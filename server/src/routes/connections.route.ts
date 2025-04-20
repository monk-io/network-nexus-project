import { Router, RequestHandler } from "express";
import { Types } from "mongoose";
import Connection, { IConnection } from "../models/connection.model";
import User, { IUser } from "../models/user.model";

// Auth0 attaches JWT payload on req.auth
interface AuthenticatedRequest {
  auth?: { sub?: string };
}

const router = Router();

// GET /api/connections - list current user's connections
const getConnections: RequestHandler = async (req, res, next) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;
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
          conn.from.toString() === userId.toString() ? conn.to : conn.from
        );
        return User.find({ _id: { $in: otherIds } })
          .select("_id sub name title avatarUrl username")
          .lean();
      })
      .then((users) => res.json(users))
      .catch((err) => next(err));
  } catch (err) {
    next(err);
  }
};
router.get("/", getConnections);

// POST /api/connections - create a new connection request
const createConnection: RequestHandler = async (req, res, next) => {
  const { to } = req.body; // Assuming 'to' is already a valid ObjectId string from the client
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

    // Check if 'to' user exists (optional but good practice)
    const toUser = await User.findById(to).select("_id");
    if (!toUser) {
      res.status(404).json({ error: "Target user not found" });
      return;
    }

    const conn = await Connection.create({
      from: userId,
      to: new Types.ObjectId(to), // Convert 'to' string to ObjectId
    });
    res.status(201).json(conn);
  } catch (err) {
    next(err);
  }
};
router.post("/", createConnection);

// GET /api/connections/pending - list pending connection requests for the current user
const getPending: RequestHandler = async (req, res, next) => {
  const page = parseInt(req.query.page as string, 10) || 1;
  const limit = parseInt(req.query.limit as string, 10) || 50;
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

    const conns = await Connection.find({ status: "pending", to: userId })
      .skip(skip)
      .limit(limit)
      .populate("from", "sub name title avatarUrl username")
      .lean();
    res.json(conns);
  } catch (err) {
    next(err);
  }
};
router.get("/pending", getPending);

// PATCH /api/connections/:id - update connection status (accept/reject)
const updateConnection: RequestHandler = async (req, res, next) => {
  const { id } = req.params; // This is the Connection _id
  const { status } = req.body;
  const authReq = req as AuthenticatedRequest;
  const userSub = authReq.auth?.sub;
  if (!userSub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  if (status !== "connected" && status !== "rejected") {
    res.status(400).json({ error: "Invalid status update" });
    return;
  }

  try {
    const currentUser = await User.findOne({ sub: userSub }).select("_id");
    if (!currentUser) {
      res.status(404).json({ error: "Current user not found" });
      return;
    }
    const userId = currentUser._id as Types.ObjectId;

    const conn = await Connection.findOneAndUpdate(
      { _id: new Types.ObjectId(id), to: userId }, // Ensure the user is the recipient
      { status },
      { new: true }
    );
    if (!conn) {
      res
        .status(404)
        .json({ error: "Connection not found or user not authorized" });
      return;
    }
    res.json(conn);
  } catch (err) {
    next(err);
  }
};
router.patch("/:id", updateConnection);

// DELETE /api/connections/:id - reject (remove) a connection request or remove existing connection
const deleteConnection: RequestHandler = async (req, res, next) => {
  const { id } = req.params; // This is the Connection _id
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

    // Find the connection first to check authorization
    const connection = await Connection.findById(id);
    if (!connection) {
      res.status(404).json({ error: "Connection not found" });
      return;
    }

    // User must be either the sender or recipient to delete
    if (!connection.from.equals(userId) && !connection.to.equals(userId)) {
      res
        .status(403)
        .json({ error: "User not authorized to delete this connection" });
      return;
    }

    // If the connection was found and user is authorized, delete it
    await Connection.findByIdAndDelete(id);
    res.json(connection); // Return the deleted connection info
  } catch (err) {
    next(err);
  }
};
router.delete("/:id", deleteConnection);

// GET /api/connections/suggestions - list "People You May Know" suggestions
const getSuggestions: RequestHandler = async (req, res, next) => {
  const authReq = req as AuthenticatedRequest;
  const userSub = authReq.auth?.sub;
  console.log(`[Suggestions] Received request for userSub: ${userSub}`); // Log userSub
  if (!userSub) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const sampleSize = 4; // Number of random suggestions to return

  try {
    const currentUser = await User.findOne({ sub: userSub }).select(
      "_id name username"
    ); // Select username
    console.log(
      `[Suggestions] Found currentUser: ${JSON.stringify(currentUser)}`
    ); // Log currentUser
    if (!currentUser) {
      res.status(404).json({ error: "Current user not found" });
      return;
    }
    const userId = currentUser._id as Types.ObjectId;

    // IDs of current user's connections
    const conns: IConnection[] = await Connection.find({
      status: "connected",
      $or: [
        { from: userId }, // No need for new Types.ObjectId() if userId is already one
        { to: userId },
      ],
    }).lean();
    const connectionIds: Types.ObjectId[] = conns.map((c) =>
      (c.from as Types.ObjectId).equals(userId)
        ? (c.to as Types.ObjectId)
        : (c.from as Types.ObjectId)
    );

    // IDs of pending requests (sent or received)
    const pendings: IConnection[] = await Connection.find({
      status: "pending",
      $or: [{ from: userId }, { to: userId }],
    }).lean();
    const pendingIds: Types.ObjectId[] = pendings.map((c) =>
      (c.from as Types.ObjectId).equals(userId)
        ? (c.to as Types.ObjectId)
        : (c.from as Types.ObjectId)
    );

    // Combine all excluded IDs (self, connections, pending)
    const excludedIds = [userId, ...connectionIds, ...pendingIds].filter(
      (id, index, self) => self.findIndex((i) => i.equals(id)) === index
    ); // Ensure uniqueness
    console.log(
      `[Suggestions] Excluded IDs count: ${
        excludedIds.length
      }, IDs: ${excludedIds.map((id) => id.toString()).join(", ")}`
    ); // Log excluded IDs

    // Fetch candidate users using aggregation and $sample
    const candidates = await User.aggregate([
      { $match: { _id: { $nin: excludedIds } } }, // Exclude specific users
      { $sample: { size: sampleSize } }, // Get a random sample
      {
        $project: {
          // Explicitly select fields, including username
          _id: 1,
          sub: 1,
          name: 1,
          title: 1,
          avatarUrl: 1,
          username: 1,
        },
      },
    ]).exec();
    console.log(`[Suggestions] Found candidates: ${candidates.length}`); // Log number of candidates

    // No need to calculate mutual connections for this simple suggestion
    res.json(candidates);
  } catch (err) {
    next(err);
  }
};
router.get("/suggestions", getSuggestions);

export default router;
