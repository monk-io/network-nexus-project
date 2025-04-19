import { Router, RequestHandler } from "express";
import { Types } from "mongoose";
import Post from "../models/post.model";
import Comment from "../models/comment.model";
import Connection from "../models/connection.model";

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
const createPost: RequestHandler = (req, res, next) => {
  const { content, imageUrl } = req.body;
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.auth?.sub;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Post.create({ author: new Types.ObjectId(userId), content, imageUrl })
    .then((newPost) => res.status(201).json(newPost))
    .catch((err) => next(err));
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
    .then((comments) => res.json(comments))
    .catch((err) => next(err));
};
router.get("/:postId/comments", listComments);

// POST /api/posts/:postId/comments - add a comment to a post
const addComment: RequestHandler = (req, res, next) => {
  const { postId } = req.params;
  const { content } = req.body;
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.auth?.sub;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  Comment.create({
    post: new Types.ObjectId(postId),
    author: new Types.ObjectId(userId),
    content,
  })
    .then((comment) => res.status(201).json(comment))
    .catch((err) => next(err));
};
router.post("/:postId/comments", addComment);

// GET /api/posts/feed - list feed posts (connections' posts or posts they commented on)
const feedHandler: RequestHandler = (req, res, next) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 50;
  const skip = (page - 1) * limit;
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.auth?.sub;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // 1) find connected user IDs
  Connection.find({
    status: "connected",
    $or: [
      { from: new Types.ObjectId(userId) },
      { to: new Types.ObjectId(userId) },
    ],
  })
    .then((conns) => {
      const connIds = conns.map((c) =>
        c.from.toString() === userId ? c.to : c.from
      );
      // 2) find posts those connections commented on
      return Comment.find({ author: { $in: connIds } }).then((coms) => ({
        connIds,
        commentedPostIds: [...new Set(coms.map((c) => c.post.toString()))],
      }));
    })
    .then(({ connIds, commentedPostIds }) => {
      return Post.find({
        $or: [
          { author: { $in: connIds } },
          {
            _id: { $in: commentedPostIds.map((id) => new Types.ObjectId(id)) },
          },
        ],
      })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit);
    })
    .then((posts) => res.json(posts))
    .catch((err) => next(err));
};
router.get("/feed", feedHandler);

export default router;
