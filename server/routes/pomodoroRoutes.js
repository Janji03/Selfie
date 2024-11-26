// routes/pomodoroRoutes.js
import express from 'express';
import { createPomodoro, getPreviousPomodoros } from '../controllers/pomodoroController.js';

const router = express.Router();

router.post('/', createPomodoro);

router.get('/', getPreviousPomodoros);

export default router;
