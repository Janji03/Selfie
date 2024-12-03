// routes/pomodoroRoutes.js
import express from 'express';
import { createPomodoro, getUserPomodoros } from '../controllers/pomodoroController.js';

const router = express.Router();

router.post('/', createPomodoro);

router.get('/', getUserPomodoros);

export default router;
