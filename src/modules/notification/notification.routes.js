import express from "express";
import * as notificationController from "./notification.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/", notificationController.getInbox);
router.patch("/:id/read", notificationController.markAsRead);

export default router;
