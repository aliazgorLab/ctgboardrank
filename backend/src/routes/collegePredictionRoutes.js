import express from 'express';
import { getCollegePrediction } from '../controllers/collegePredictionController.js';

const router = express.Router();

// GET /api/college-prediction/:roll or GET /api/college-prediction?roll=112257
router.get('/:roll?', getCollegePrediction);

export default router;
