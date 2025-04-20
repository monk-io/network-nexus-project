// Redis client setup
import { createClient } from "redis";

// URL should be set in an environment variable: REDIS_URL (e.g. redis://localhost:6379)
const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

redisClient.connect().then(() => {
  console.log("Connected to Redis");
});

export default redisClient;
