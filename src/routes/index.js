import express from "express";

import healthRoutes from "./health.routes.js";
import authRoutes from "../modules/auth/auth.routes.js";
import userRoutes from "../modules/user/user.routes.js";
import postRoutes from "../modules/post/post.routes.js";
import commentRoutes from "../modules/comment/comment.routes.js";
import followRoutes from "../modules/follow/follow.routes.js";
import voteRoutes from "../modules/vote/vote.routes.js";
import notificationRoutes from "../modules/notification/notification.routes.js";
import paymentRoutes from "../modules/payment/payment.routes.js";
import searchRoutes from "../modules/search/search.routes.js";
import adminRoutes from "../modules/admin/admin.routes.js";

const router = express.Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/users", followRoutes);
router.use("/posts", postRoutes);
router.use("/posts", commentRoutes);
router.use("/posts", voteRoutes);
router.use("/notifications", notificationRoutes);
router.use("/payments", paymentRoutes);
router.use("/search", searchRoutes);
router.use("/admin", adminRoutes);

export default router;
