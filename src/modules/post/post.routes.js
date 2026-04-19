import express from "express";
import * as postController from "./post.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Secure all routes with protect middleware
router.use(protect);

router.post("/", postController.createPost);

export default router;
