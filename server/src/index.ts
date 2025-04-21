import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import mongoose from "mongoose";
import Redis from "ioredis";
import config from "./config";
import { checkJwt } from "./middleware/auth";
import postsRouter from "./routes/posts.route";
import usersRouter from "./routes/users.route";
import connectionsRouter from "./routes/connections.route";
import { seedDatabase } from "./seed"; // Import the seeding function

async function start() {
  // Connect to MongoDB
  await mongoose.connect(config.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Seed the database (runs only if needed)
  await seedDatabase();

  // Connect to Redis
  const redisClient = new Redis(config.REDIS_URL);
  console.log("Connected to Redis");

  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // API routes (protected)
  app.use("/api/posts", checkJwt, postsRouter);
  app.use("/api/users", checkJwt, usersRouter);
  app.use("/api/connections", checkJwt, connectionsRouter);

  // Global error handler
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err);
    const status = (err as { status?: number }).status ?? 500;
    const message = err instanceof Error ? err.message : String(err);
    res.status(status).json({ error: message });
  });

  // Start server
  app.listen(config.PORT, () => {
    console.log(`Server listening on port ${config.PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
