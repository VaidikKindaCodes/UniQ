import http from "http";
import app from "./app.js";


import dbConnect from "./config/db.js";
import { closeRedis, initializeRedis, isRedisReady } from "./config/redis.js";
import { startTokenExpiryJob } from "./cron/tokenExpiry.job.js";
import { rebuildRedisStateFromMongo } from "./modules/queue/services/redisQueue.service.js";
import { initializeSocket } from "./server/socket.js";


const waitForRedis = (timeoutMs = 10000): Promise<void> => {
  return new Promise((resolve) => {
    // 1. Check immediately
    if (isRedisReady()) return resolve();

    // 2. Poll every 200ms
    const interval = setInterval(() => {
      if (isRedisReady()) {
        clearInterval(interval);
        resolve();
      }
    }, 200);

    // 3. Absolute cutoff
    setTimeout(() => {
      clearInterval(interval);
      if (isRedisReady()) {
        console.log("redis is ready");
        resolve(); // Double check one last time before complaining
      } else {
        console.warn("⚠️ Redis not ready after timeout, continuing without it");
        resolve();
      }
    }, timeoutMs);
  });
};

const startServer = async () => {
  try {
    await dbConnect();

    initializeRedis();
    await waitForRedis();

    await rebuildRedisStateFromMongo();

    startTokenExpiryJob();

    const httpServer = http.createServer(app);
    initializeSocket(httpServer);

    httpServer.listen(env.PORT, () => {
      console.log(`✅ Server running on port ${env.PORT}`);
      console.log(`✅ Environment: ${env.NODE_ENV}`);
    });

    const shutdown = async (signal: string) => {
      console.info(`\n${signal} received, shutting down gracefully...`);
      httpServer.close(async () => {
        await closeRedis();
        console.info("✅ Server shut down cleanly");
        process.exit(0);
      });
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

  } catch (error) {
    console.error("❌ Failed to start server:", error);
    await closeRedis();
    process.exit(1);
  }
};

startServer();