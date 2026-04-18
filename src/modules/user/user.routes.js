import express from 'express';
import * as userController from './user.controller.js';
import { protect } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// This route is protected - user must be logged in
router.patch('/select-neighborhood', protect, userController.selectNeighborhood);

export default router;