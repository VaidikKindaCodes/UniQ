import { Redis } from "ioredis";
import { env } from "./env.js";

let redisClient: Redis | null = null;
let redisSubscriber: Redis | null = null;
let redisReady = false;
let redisReadyLogged = false;

export const initializeRedis = (): void => {
  if (redisClient) return;

  // 1. Remove lazyConnect so it starts connecting immediately
  // 2. Ensure the URL is definitely 127.0.0.1
  redisClient = new Redis(env.REDIS_URL, {
    enableReadyCheck: true,
    maxRetriesPerRequest: null, // Set to null for better stability during startup
    // lazyConnect: false, // (Default is false, better for startup checks)
    retryStrategy: (times) => {
      console.log(`Retrying Redis connection: attempt ${times}`);
      return Math.min(times * 2000, 30000);
    },
  });

  redisClient.on("connect", () => {
    console.log("📡 Attempting to connect to Redis...");
  });

  redisClient.on("ready", () => {
    redisReady = true;
    console.info("✅ Redis connected and ready");
    
    if (!redisSubscriber) {
      redisSubscriber = redisClient!.duplicate();
      // Duplicate doesn't need manual .connect() if lazyConnect is false
    }
  });

  redisClient.on("error", (error) => {
    redisReady = false;
    // THIS LOG IS CRUCIAL - check your terminal for this output!
    console.error("❌ Redis Connection Error Details:", error.message);
  });
};

export const getRedisClient = (): Redis | null => redisClient;
export const getRedisSubscriber = (): Redis | null => redisSubscriber;
export const isRedisReady = (): boolean => redisReady;

export const closeRedis = async (): Promise<void> => {
  if (redisSubscriber) {
    await redisSubscriber.quit();
    redisSubscriber = null;
  }
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
  redisReady = false;
  console.info("✅ Redis connections closed gracefully");
};