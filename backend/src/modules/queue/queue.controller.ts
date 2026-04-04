import { Response } from "express";
import { Queue } from "./queue.model.js";
import { Token, TokenStatus } from "./token.model.js";
import { TokenService } from "./services/token.service.js";
import { AuthRequest } from "../../middlewares/auth.js";
import { ensureQueueAccess } from "../operator/operator.utils.js";
import { broadcastQueueUpdate } from "../../server/socket.js";
import { getQueuePredictedWait } from "./services/predictedWait.service.js";
import {
  getWaitingTokens,
  getNowServing,
  removeToken,
  setNowServing,
} from "./services/redisQueue.service.js";

// ─── PREDICTED WAIT TIME ─────────────────────────────────────────────────────

export async function getPredictedWaitTime(req: AuthRequest, res: Response) {
  try {
    const { queueId } = req.params;
    const predictedWaitMinutes = await getQueuePredictedWait(queueId);

    if (predictedWaitMinutes === null || predictedWaitMinutes === undefined) {
      return res.status(200).json({
        queueId,
        predictedWaitMinutes: null,
        success: false,
        error: "Prediction unavailable",
      });
    }

    return res.status(200).json({
      queueId,
      predictedWaitMinutes: Math.round(predictedWaitMinutes),
      success: true,
    });
  } catch (error) {
    console.error("Predicted Wait Error:", error);
    return res.status(500).json({
      queueId: req.params.queueId,
      predictedWaitMinutes: null,
      success: false,
      error: "Failed to get predicted wait time",
    });
  }
}

// ─── CREATE QUEUE ─────────────────────────────────────────────────────────────

export async function createQueue(req: AuthRequest, res: Response) {
  try {
    const { name, location, operator, capacity } = req.body;
    const operatorId = operator || req.user?.sub;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        error: "Queue name and location are required",
      });
    }

    if (capacity !== undefined && (isNaN(Number(capacity)) || Number(capacity) <= 0)) {
      return res.status(400).json({
        success: false,
        error: "Capacity must be a positive number",
      });
    }

    const existingQueue = await Queue.findOne({ name, location });
    if (existingQueue) {
      return res.status(409).json({
        success: false,
        error: "A queue with this name and location already exists",
      });
    }

    const queue = await Queue.create({
      name,
      location,
      operator: operatorId || null,
      isActive: true,
      nextSequence: 1,
      capacity: capacity ? Number(capacity) : undefined,
      isFull: false,
    });

    return res.status(201).json({
      success: true,
      queue: {
        id: queue._id,
        name: queue.name,
        location: queue.location,
        isActive: queue.isActive,
        operator: queue.operator,
        createdAt: queue.createdAt,
      },
    });
  } catch (error) {
    console.error("Create Queue Error:", error);
    return res.status(500).json({ success: false, error: "Failed to create queue" });
  }
}

// ─── GENERATE TOKEN ───────────────────────────────────────────────────────────

export async function generateToken(req: AuthRequest, res: Response) {
  const { queueId } = req.params;
  const userId = req.user?.sub;

  console.log(
    `[Token] Request to generate token for queue: ${queueId}${userId ? ` for user: ${userId}` : ""}`,
  );

  const result = await TokenService.generateToken(queueId, userId);
  console.log(`[Token] Result:`, result);

  if (!result.success) {
    let status = 400;
    if (result.retryAfterSeconds) {
      status = 429;
    } else if (result.error && (result.error.includes("already") || result.error.includes("full"))) {
      status = 409;
    }
    return res.status(status).json(result);
  }

  await broadcastQueueUpdate(queueId);
  return res.status(201).json(result);
}

// ─── UPDATE TOKEN STATUS ──────────────────────────────────────────────────────

export async function updateTokenStatus(req: AuthRequest, res: Response) {
  const { tokenId } = req.params;
  const { status } = req.body;

  if (!Object.values(TokenStatus).includes(status)) {
    return res.status(400).json({ success: false, error: "Invalid token status" });
  }

  let expiryDate: Date | undefined;
  if (status === TokenStatus.SERVED) {
    const token = await Token.findById(tokenId).populate("queue");
    if (token && token.queue) {
      // @ts-ignore - populated queue access
      const expiryMinutes = token.queue.tokenExpiryMinutes || 5;
      expiryDate = new Date(Date.now() + expiryMinutes * 60 * 1000);
    }
  }

  const result = await TokenService.updateStatus(tokenId, status, expiryDate);

  if (!result.success) {
    return res.status(400).json(result);
  }

  if (result.token?.queueId) {
    await broadcastQueueUpdate(result.token.queueId);
  }

  return res.status(200).json(result);
}

// ─── OPERATOR VIEW ────────────────────────────────────────────────────────────

export async function getQueueOperatorView(req: AuthRequest, res: Response) {
  try {
    const { queueId } = req.params;

    const { queue, error } = await ensureQueueAccess(queueId, req.user);
    if (error) {
      return res.status(error.status).json({ success: false, error: error.message });
    }
    if (!queue) {
      return res.status(404).json({ success: false, error: "Queue not found" });
    }

    const capacity = queue.capacity || 50;

    // FIX: Use Redis for live positions, fall back to MongoDB if unavailable
    const redisTokens = await getWaitingTokens(queueId);
    const redisNowServing = await getNowServing(queueId);

    let waitingTokens: Array<{ id: any; seq: number; status: string }>;
    let nowServingToken: { id: any; seq: number } | null = null;

    if (redisTokens !== null) {
      // Redis available — get accurate positions from Redis, details from MongoDB
      const tokenIds = redisTokens.map((t) => t.id);
      const tokenDocs = await Token.find({
        _id: { $in: tokenIds },
        status: TokenStatus.WAITING,
      })
        .sort({ seq: 1 })
        .select("id seq status")
        .lean();

      waitingTokens = tokenDocs.map((t) => ({
        id: t._id,
        seq: t.seq,
        status: t.status,
      }));

      if (redisNowServing) {
        const servingDoc = await Token.findById(redisNowServing)
          .select("id seq status")
          .lean();
        if (servingDoc) {
          nowServingToken = { id: servingDoc._id, seq: servingDoc.seq };
        }
      }
    } else {
      // Redis unavailable — fall back to MongoDB
      const mongoTokens = await Token.find({
        queue: queueId,
        status: TokenStatus.WAITING,
      })
        .sort({ seq: 1 })
        .select("id seq status")
        .lean();

      waitingTokens = mongoTokens.map((t) => ({
        id: t._id,
        seq: t.seq,
        status: t.status,
      }));

      const servingDoc = await Token.findOne({
        queue: queueId,
        status: TokenStatus.SERVED,
      })
        .sort({ updatedAt: -1 })
        .select("id seq status")
        .lean();

      if (servingDoc) {
        nowServingToken = { id: servingDoc._id, seq: servingDoc.seq };
      }
    }

    const isFull = queue.isFull || waitingTokens.length >= capacity;

    return res.status(200).json({
      queue: {
        id: queue._id,
        name: queue.name,
        location: queue.location,
        status: queue.isActive ? "ACTIVE" : "PAUSED",
        capacity,
        isFull,
      },
      tokens: waitingTokens.map((t) => ({
        id: t.id,
        number: t.seq,
        status: t.status,
      })),
      nowServing: nowServingToken
        ? { id: nowServingToken.id, number: nowServingToken.seq }
        : null,
    });
  } catch (error) {
    console.error("Get Operator View Error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch queue state" });
  }
}

// ─── PUBLIC QUEUE LISTING ─────────────────────────────────────────────────────

export async function getQueuesForUsers(req: AuthRequest, res: Response) {
  try {
    const queues = await Queue.find({}).select(
      "name location isActive createdAt capacity isFull",
    );

    const queuesWithStats = await Promise.all(
      queues.map(async (queue) => {
        const capacity = queue.capacity || 50;

        const waitingCount = await Token.countDocuments({
          queue: queue._id,
          status: TokenStatus.WAITING,
        });

        const estimatedWaitTime = waitingCount * 5;
        const isFull = queue.isFull || waitingCount >= capacity;
        const status: "open" | "paused" | "full" = !queue.isActive
          ? "paused"
          : isFull
            ? "full"
            : "open";

        return {
          queueId: queue._id.toString(),
          queueName: queue.name,
          location: queue.location,
          counterNumber: 1,
          queueLength: waitingCount,
          waitTime: estimatedWaitTime,
          status,
          capacity,
          isFull,
          availableSlots: Math.max(capacity - waitingCount, 0),
        };
      }),
    );

    return res.status(200).json({ success: true, queues: queuesWithStats });
  } catch (error) {
    console.error("Get Queues Error:", error);
    return res.status(500).json({ success: false, error: "Failed to fetch queues" });
  }
}

// ─── OPERATOR OVERRIDE ACTIONS ────────────────────────────────────────────────

export async function extendTokenTime(req: AuthRequest, res: Response) {
  try {
    const { tokenId } = req.params;
    const { minutes } = req.body;
    const extendBy = minutes ? Number(minutes) : 2;

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ error: "Token not found" });

    if (token.status !== TokenStatus.SERVED || !token.expireAt) {
      return res.status(400).json({ error: "Token is not currently serving or has no expiry" });
    }

    token.expireAt = new Date(token.expireAt.getTime() + extendBy * 60 * 1000);
    await token.save();

    await broadcastQueueUpdate(token.queue.toString());
    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Extend Token Error:", error);
    return res.status(500).json({ success: false, error: "Failed to extend time" });
  }
}

export async function markTokenNoShow(req: AuthRequest, res: Response) {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId);
    if (!token) return res.status(404).json({ error: "Token not found" });

    token.status = TokenStatus.EXPIRED;
    token.expireAt = undefined;
    await token.save();

    // FIX: Remove from Redis so the token disappears from live queue
    await removeToken(token.queue.toString(), tokenId);
    await broadcastQueueUpdate(token.queue.toString());

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Mark No-Show Error:", error);
    return res.status(500).json({ success: false, error: "Failed to mark no-show" });
  }
}

export async function recallToken(req: AuthRequest, res: Response) {
  try {
    const { tokenId } = req.params;

    const token = await Token.findById(tokenId).populate("queue");
    if (!token) return res.status(404).json({ error: "Token not found" });

    if (![TokenStatus.EXPIRED, TokenStatus.SKIPPED].includes(token.status as TokenStatus)) {
      return res.status(400).json({ error: "Can only recall expired or skipped tokens" });
    }

    token.status = TokenStatus.SERVED;
    // @ts-ignore - populated queue access
    const expiryMinutes = token.queue.tokenExpiryMinutes || 5;
    token.expireAt = new Date(Date.now() + expiryMinutes * 60 * 1000);
    await token.save();

    // FIX: Update Redis to reflect recalled token is now being served
    await setNowServing(token.queue._id.toString(), tokenId);
    await broadcastQueueUpdate(token.queue._id.toString());

    return res.status(200).json({ success: true, token });
  } catch (error) {
    console.error("Recall Token Error:", error);
    return res.status(500).json({ success: false, error: "Failed to recall token" });
  }
}