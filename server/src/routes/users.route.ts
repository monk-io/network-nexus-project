import { Router, RequestHandler } from "express";
import { Types } from "mongoose";
import User from "../models/user.model";
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

export default router;
