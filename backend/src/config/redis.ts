import { Redis } from "ioredis";
import { env } from "./env.js";

let redisClient: Redis | null = null;
let redisSubscriber: Redis | null = null;
let redisReady = false;
let redisReadyLogged = false;

export const initializeRedis = (): void => {
  if (redisClient) return;
  redisClient = new Redis(env.REDIS_URL, {
    enableReadyCheck: true,
    maxRetriesPerRequest: null, 
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
    }
  });

  redisClient.on("error", (error) => {
    redisReady = false;
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