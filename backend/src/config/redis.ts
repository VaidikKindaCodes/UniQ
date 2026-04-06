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
    maxRetriesPerRequest: 1,
    lazyConnect: true,
    retryStrategy: (times) => {
      const delay = Math.min(times * 2000, 60000);
      return delay;
    },
  });

  redisClient.on("ready", () => {
    redisReady = true;
    if (!redisReadyLogged) {
      console.info("✅ Redis connected and ready");
      redisReadyLogged = true;
    }

    if (!redisSubscriber) {
      redisSubscriber = redisClient!.duplicate();

      redisSubscriber.on("error", (error) => {
        console.warn("⚠️ Redis subscriber error:", error);
      });

      redisSubscriber.on("ready", () => {
        console.info("✅ Redis subscriber ready");
      });

      // Duplicate inherits lazyConnect so must connect explicitly
      redisSubscriber.connect().catch(() => {});
    }
  });

  redisClient.on("error", (error) => {
    redisReady = false;
    console.warn("⚠️ Redis error (fallback to MongoDB):", error);
  });

  redisClient.on("end", () => {
    redisReady = false;
    console.warn("⚠️ Redis connection closed (fallback to MongoDB)");
  });

  redisClient.connect().catch(() => {});
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