import express from "express";
import * as voteController from "./vote.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/:postId/vote", voteController.handleVote);

export default router;
