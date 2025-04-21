import { Router, RequestHandler } from "express";
import { Types } from "mongoose";
import Post from "../models/post.model";
import Comment from "../models/comment.model";
import Connection from "../models/connection.model";
import User from "../models/user.model";
import redisClient from "../lib/redis";

const router = Router();

// Auth0 attaches the JWT payload to req.auth
interface AuthenticatedRequest {
  auth?: { sub?: string };
}

// Handler to list posts
const listPosts: RequestHandler = (req, res, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;
  Post.find()
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .then((posts) => res.json(posts))
    .catch((err) => next(err));
};

router.get("/", listPosts);

// Handler to create a post
const createPost: RequestHandler = async (req, res, next) => {
  const { content, imageUrl } = req.body;
  const authReq = req as AuthenticatedRequest;
  const userSub = authReq.auth?.sub;
  if (!userSub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const currentUser = await User.findOne({ sub: userSub }).select("_id");
    if (!currentUser) {
      res.status(404).json({ error: "Current user not found" });
      return;
    }
    const userId = currentUser._id as Types.ObjectId;

    const newPost = await Post.create({ author: userId, content, imageUrl });

    // Invalidate feed cache for this user
    try {
      const scanPattern = `feed:${userId.toString()}:*`;
      let cursor = 0; // Use number for cursor
      const keysToDelete: string[] = [];

      do {
        // Use node-redis v4 scan signature with options object
        const reply = await redisClient.scan(cursor, {
          MATCH: scanPattern,
          COUNT: 100,
        });
        cursor = reply.cursor;
        keysToDelete.push(...reply.keys);
      } while (cursor !== 0);

      if (keysToDelete.length > 0) {
        await redisClient.del(keysToDelete);
        console.log(
          `Invalidated ${
            keysToDelete.length
          } feed cache keys for user ${userId.toString()}`
        );
      }
    } catch (cacheError) {
      console.error("Error invalidating feed cache:", cacheError);
    }

    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
};

router.post("/", createPost);

// GET /api/posts/:postId/comments - list comments for a post
const listComments: RequestHandler = (req, res, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const skip = (page - 1) * limit;
  const { postId } = req.params;
  Comment.find({ post: new Types.ObjectId(postId) })
    .sort({ createdAt: 1 })
    .skip(skip)
    .limit(limit)
    .populate("author", "sub name title avatarUrl username")
    .then((comments) => res.json(comments))
    .catch((err) => next(err));
};
router.get("/:postId/comments", listComments);

// POST /api/posts/:postId/comments - add a comment to a post
const addComment: RequestHandler = async (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const authReq = req as AuthenticatedRequest;
  const userSub = authReq.auth?.sub;
  if (!userSub || !content || !postId) {
    res
      .status(400)
      .json({ error: "Missing required fields (postId, content, auth)" });
    return;
  }

  try {
    const currentUser = await User.findOne({ sub: userSub }).select("_id");
    if (!currentUser) {
      res.status(404).json({ error: "Current user not found" });
      return;
    }
    const userId = currentUser._id as Types.ObjectId;

    // Validate postId format before using it
    if (!Types.ObjectId.isValid(postId)) {
      res.status(400).json({ error: "Invalid post ID format" });
      return;
    }
    const postObjectId = new Types.ObjectId(postId);

    // 1. Create the comment
    const comment = await Comment.create({
      post: postObjectId,
      author: userId,
      content,
    });

    // 2. Increment the comment count on the parent post
    console.log(`Attempting to increment comment count for PostId: ${postId}`);
    try {
      const updatedPost = await Post.findByIdAndUpdate(
        postObjectId,
        { $inc: { comments: 1 } },
        { new: true }
      );

      if (!updatedPost) {
        console.warn(
          `Comment count increment failed: Post not found? PostId: ${postId}`
        );
      } else {
        console.log(
          `Successfully incremented comment count for PostId: ${postId}. New count: ${updatedPost.comments}`
        );
      }
    } catch (updateError) {
      console.error(
        `Error incrementing comment count for PostId: ${postId}:`,
        updateError
      );
    }

    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};
router.post("/:postId/comments", addComment);

// GET /api/posts/feed - list feed posts (connections' posts or posts commented on) with Redis cache
const feedHandler: RequestHandler = async (req, res, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;
  const authReq = req as AuthenticatedRequest;
  const userSub = authReq.auth?.sub;
  if (!userSub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const currentUser = await User.findOne({ sub: userSub }).select("_id");
    if (!currentUser) {
      res.status(404).json({ error: "Current user not found" });
      return;
    }
    const userId = currentUser._id as Types.ObjectId;

    const cacheKey = `feed:${userId.toString()}:page:${page}:limit:${limit}`;

    // Try cache
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      res.json(JSON.parse(cached));
      return;
    }

    // Database logic: connections and commented post IDs
    const conns = await Connection.find({
      status: "connected",
      $or: [{ from: userId }, { to: userId }],
    })
      .lean()
      .exec();
    const connIds: Types.ObjectId[] = conns.map((c) => {
      const fromId = c.from as Types.ObjectId;
      const toId = c.to as Types.ObjectId;
      return fromId.equals(userId) ? toId : fromId;
    });

    // Fetch IDs of posts commented on by connections
    const coms = await Comment.find({ author: { $in: connIds } })
      .select("post")
      .lean()
      .exec();
    // Ensure unique ObjectIds
    const commentedPostIds = [
      ...new Map(
        coms.map((c) => [
          (c.post as Types.ObjectId).toString(),
          c.post as Types.ObjectId,
        ])
      ).values(),
    ];

    // Fetch posts: authored by connections OR commented on by connections OR authored by self
    const posts = await Post.find({
      $or: [
        { author: { $in: connIds } },
        { _id: { $in: commentedPostIds } },
        { author: userId },
      ],
    })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "sub name title avatarUrl username")
      .lean()
      .exec();

    // Cache for 30 seconds
    await redisClient.set(cacheKey, JSON.stringify(posts), { EX: 30 });
    res.json(posts);
    return;
  } catch (err) {
    return next(err);
  }
};
router.get("/feed", feedHandler);

// POST /api/posts/:postId/like - increment like count
const likePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.params;
  const authReq = req as AuthenticatedRequest;
  const userSub = authReq.auth?.sub;
  if (!userSub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const currentUser = await User.findOne({ sub: userSub }).select("_id");
    if (!currentUser) {
      res.status(404).json({ error: "Current user not found" });
      return;
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    void (post
      ? res.json(post)
      : res.status(404).json({ error: "Post not found" }));
  } catch (err) {
    next(err);
  }
};
router.post("/:postId/like", likePost);

// DELETE /api/posts/:postId/like - decrement like count
const unlikePost: RequestHandler = async (req, res, next) => {
  const { postId } = req.params;
  const authReq = req as AuthenticatedRequest;
  const userSub = authReq.auth?.sub;
  if (!userSub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  try {
    const currentUser = await User.findOne({ sub: userSub }).select("_id");
    if (!currentUser) {
      res.status(404).json({ error: "Current user not found" });
      return;
    }

    const post = await Post.findByIdAndUpdate(
      postId,
      { $inc: { likes: -1 } },
      { new: true }
    );
    void (post
      ? res.json(post)
      : res.status(404).json({ error: "Post not found" }));
  } catch (err) {
    next(err);
  }
};
router.delete("/:postId/like", unlikePost);

export default router;
