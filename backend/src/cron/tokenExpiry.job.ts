import { Token, TokenStatus } from "../modules/queue/token.model.js";
import { broadcastQueueUpdate } from "../server/socket.js";
import {
  removeToken,
  setNowServing,
} from "../modules/queue/services/redisQueue.service.js";
import { syncQueueFullFlag } from "../modules/queue/services/capacity.service.js";

const EXPIRY_CHECK_INTERVAL_MS = 30 * 1000;

export const startTokenExpiryJob = () => {
  console.log("⏰ Starting Token Expiry Job...");

  setInterval(async () => {
    try {
      const now = new Date();

      const expiredTokens = await Token.find({
        status: TokenStatus.SERVED,
        expireAt: { $lt: now },
      });

      if (expiredTokens.length === 0) return;

      console.log(`⏰ Found ${expiredTokens.length} expired tokens. Processing...`);

      // Track which queues were affected so we only broadcast once per queue
      const affectedQueues = new Set<string>();

      for (const token of expiredTokens) {
        const queueId = token.queue.toString();

        token.status = TokenStatus.EXPIRED;
        token.expireAt = undefined;
        await token.save();

        // Remove from Redis sorted set (defensive — served tokens
        // are already removed, but handles any edge case)
        await removeToken(queueId, token._id.toString());

        // Clear now serving since this token is no longer valid
        await setNowServing(queueId, null);

        // Sync isFull flag so queue opens up if it was full
        await syncQueueFullFlag(queueId);

        affectedQueues.add(queueId);
        console.log(`❌ Token ${token._id} (Seq: ${token.seq}) expired for queue ${queueId}`);
      }

      // Broadcast once per affected queue instead of once per token
      for (const queueId of affectedQueues) {
        await broadcastQueueUpdate(queueId);
      }
    } catch (error) {
      console.error("Error in Token Expiry Job:", error);
    }
  }, EXPIRY_CHECK_INTERVAL_MS);
};