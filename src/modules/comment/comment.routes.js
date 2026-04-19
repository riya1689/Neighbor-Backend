import express from "express";
import * as commentController from "./comment.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/:postId/comments", commentController.createComment);
router.get("/:postId/comments", commentController.getPostComments);

export default router;
