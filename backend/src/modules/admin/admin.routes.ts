import { Router } from "express";
import { verifyJWT, authorize } from "../../middlewares/auth.js";
import {
  getAdmins,
  getDashboard,
  getDashboardSummary,
  getQueueLoadAnalytics,
  getTokensServedAnalytics,
  getAvgWaitTimeAnalytics,
  getTokenStatusAnalytics,
  sendAdminInvite,
  listQueues,
  removeQueue,
  listOperators,
  resetOpPassword,
} from "./admin.controller.js";

const router = Router();

/**
 * All routes are protected by verifyJWT + authorize("admin")
 */

router.get("/dashboard", verifyJWT, authorize("admin"), getDashboard);

router.get("/admins", verifyJWT, authorize("admin"), getAdmins);
router.post("/invite", verifyJWT, authorize("admin"), sendAdminInvite);

// Dashboard Summary - Overview metrics
router.get(
  "/dashboard/summary",
  verifyJWT,
  authorize("admin"),
  getDashboardSummary
);

// Analytics Endpoints
router.get(
  "/analytics/queue-load",
  verifyJWT,
  authorize("admin"),
  getQueueLoadAnalytics
);

router.get(
  "/analytics/tokens-served",
  verifyJWT,
  authorize("admin"),
  getTokensServedAnalytics
);

router.get(
  "/analytics/avg-wait-time",
  verifyJWT,
  authorize("admin"),
  getAvgWaitTimeAnalytics
);

router.get(
  "/analytics/token-status",
  verifyJWT,
  authorize("admin"),
  getTokenStatusAnalytics
);

// Management Endpoints
router.get("/queues", verifyJWT, authorize("admin"), listQueues);
router.delete("/queues/:queueId", verifyJWT, authorize("admin"), removeQueue);
router.get("/operators", verifyJWT, authorize("admin"), listOperators);
router.post("/operators/:operatorId/reset-password", verifyJWT, authorize("admin"), resetOpPassword);

export default router;
