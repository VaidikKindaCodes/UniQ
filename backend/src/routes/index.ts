import { Router } from "express";
import { verifyJWT, authorize } from "../middlewares/auth.js";
import authRouter from "../modules/auth/auth.routes.js";
import queueRouter from "../modules/queue/queue.routes.js";
import operatorRouter from "../modules/operator/operator.routes.js";
import adminRouter from "../modules/admin/admin.routes.js";
import notificationRouter from "../modules/notifications/email.route.js";
import fetchQueueDataRouter from "../modules/fetchQueueData/fetchQueueData.route.js";
import userStatusRouter from "../modules/updateUserStatus/userStatus.routes.js";


const router = Router();

router.use("/auth", authRouter);
router.use("/queues", queueRouter);
router.use("/operator", operatorRouter);
router.use("/operators", operatorRouter); // Alias for backward compatibility (prefer /operator)
router.use("/admin", adminRouter);
router.use("/notifications", notificationRouter);
router.use("/queue-data", fetchQueueDataRouter);
// Both /user and /user-status mount the same router for backward compatibility.
// Prefer /user for new code.
router.use("/user", verifyJWT, userStatusRouter);
router.use("/user-status", verifyJWT, userStatusRouter); // Deprecated alias — prefer /user

export default router;
