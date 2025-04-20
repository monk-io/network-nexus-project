import { Router, RequestHandler } from "express";
import { Types } from "mongoose";
import User from "../models/user.model";
import Post from "../models/post.model";
import Connection from "../models/connection.model";

// Auth0 attaches JWT payload on req.auth
interface AuthenticatedRequest {
  auth?: { sub?: string };
}

const router = Router();

// GET /api/users/:id - get user by id
const getUser: RequestHandler = (req, res, next) => {
  const { id } = req.params;
  User.findById(id)
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    })
    .catch((err) => next(err));
};
router.get("/:id", getUser);

// GET /api/users/:id/connections - list a user's connections
const getUserConnections: RequestHandler = (req, res, next) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const skip = (page - 1) * limit;
  const { id } = req.params;
  Connection.find({
    status: "connected",
    $or: [{ from: new Types.ObjectId(id) }, { to: new Types.ObjectId(id) }],
  })
    .skip(skip)
    .limit(limit)
    .then((conns) => {
      const otherIds = conns.map((conn) =>
        conn.from.toString() === id ? conn.to : conn.from
      );
      return User.find({ _id: { $in: otherIds } })
        .skip(skip)
        .limit(limit);
    })
    .then((users) => res.json(users))
    .catch((err) => next(err));
};
router.get("/:id/connections", getUserConnections);

// GET /api/users/me - get current authenticated user's profile
const getCurrentUser: RequestHandler = (req, res, next) => {
  const authReq = req as AuthenticatedRequest;
  const sub = authReq.auth?.sub;
  if (!sub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  User.findOne({ sub })
    .then((user) => {
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    })
    .catch((err) => next(err));
};
router.get("/me", getCurrentUser);

// POST /api/users - create or update a user record (upsert)
const upsertUser: RequestHandler = (req, res, next) => {
  const { sub, name, title, avatarUrl, bio, location } = req.body;
  if (!sub || !name) {
    res.status(400).json({ error: "sub and name are required" });
    return;
  }

  User.findOneAndUpdate(
    { sub },
    { sub, name, title, avatarUrl, bio, location },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  )
    .then((user) => {
      res.status(201).json(user);
    })
    .catch((err) => next(err));
};
router.post("/", upsertUser);

// GET /api/users/:id/posts - list posts by a specific user
const getUserPosts: RequestHandler = (req, res, next) => {
  const { id } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const skip = (page - 1) * limit;
  Post.find({ author: new Types.ObjectId(id) })
    .sort({ timestamp: -1 })
    .skip(skip)
    .limit(limit)
    .then((posts) => res.json(posts))
    .catch((err) => next(err));
};
router.get("/:id/posts", getUserPosts);

// GET /api/users/search - search users by name or title
const searchUsers: RequestHandler = (req, res, next) => {
  const q = req.query.query as string;
  if (!q) {
    res.json([]);
    return;
  }
  const regex = new RegExp(q, "i");
  User.find({
    $or: [{ name: { $regex: regex } }, { title: { $regex: regex } }],
  })
    .limit(10)
    .then((results) => res.json(results))
    .catch((err) => next(err));
};
router.get("/search", searchUsers);

export default router;
