import express from "express";
import * as followController from "./follow.controller.js";
import { protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:id/follow", protect, followController.followUser);
router.delete("/:id/unfollow", protect, followController.unfollowUser);

router.get("/:id/followers", followController.getFollowers);
router.get("/:id/following", followController.getFollowing);

export default router;
