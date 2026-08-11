import express from 'express';
import { getStudentRank, getLeaderboard } from '../controllers/rankController.js';

const router = express.Router();

// GET /api/rank/leaderboard
router.get('/leaderboard', getLeaderboard);

// GET /api/rank/student/:roll or GET /api/rank/:roll
router.get('/student/:roll', getStudentRank);
router.get('/:roll', getStudentRank);

export default router;
