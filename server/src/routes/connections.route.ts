import { Router, RequestHandler } from "express";
import { Types } from "mongoose";
import Connection from "../models/connection.model";
import User from "../models/user.model";

// Auth0 attaches JWT payload on req.auth
interface AuthenticatedRequest {
  auth?: { sub?: string };
}

const router = Router();

// GET /api/connections - list current user's connections
const getConnections: RequestHandler = (req, res, next) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const skip = (page - 1) * limit;
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.auth?.sub;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Connection.find({
    status: "connected",
    $or: [
      { from: new Types.ObjectId(userId) },
      { to: new Types.ObjectId(userId) },
    ],
  })
    .skip(skip)
    .limit(limit)
    .then((conns) => {
      const otherIds = conns.map((conn) =>
        conn.from.toString() === userId ? conn.to : conn.from
      );
      return User.find({ _id: { $in: otherIds } })
        .skip(skip)
        .limit(limit);
    })
    .then((users) => res.json(users))
    .catch((err) => next(err));
};
router.get("/", getConnections);

// POST /api/connections - create a new connection request
const createConnection: RequestHandler = (req, res, next) => {
  const { to } = req.body;
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.auth?.sub;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Connection.create({
    from: new Types.ObjectId(userId),
    to: new Types.ObjectId(to),
  })
    .then((conn) => res.status(201).json(conn))
    .catch((err) => next(err));
};
router.post("/", createConnection);

// GET /api/connections/pending - list pending connection requests for the current user
const getPending: RequestHandler = (req, res, next) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;
  const skip = (page - 1) * limit;
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.auth?.sub;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Connection.find({ status: "pending", to: new Types.ObjectId(userId) })
    .skip(skip)
    .limit(limit)
    .then((conns) => res.json(conns))
    .catch((err) => next(err));
};
router.get("/pending", getPending);

// PATCH /api/connections/:id - update connection status (accept/reject)
const updateConnection: RequestHandler = (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;
  const authReq = req as AuthenticatedRequest;
  const userId = authReq.auth?.sub;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  Connection.findOneAndUpdate(
    { _id: new Types.ObjectId(id), to: new Types.ObjectId(userId) },
    { status },
    { new: true }
  )
    .then((conn) => {
      if (!conn) {
        res.status(404).json({ error: "Connection not found" });
        return;
      }
      res.json(conn);
    })
    .catch((err) => next(err));
};
router.patch("/:id", updateConnection);

export default router;
