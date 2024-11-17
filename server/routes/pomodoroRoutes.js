// routes/pomodoroRoutes.js
import express from 'express';
import { createPomodoro } from '../controllers/pomodoroController.js';

const router = express.Router();

// Rotta per creare un nuovo Pomodoro
router.post('/', createPomodoro);


export default router;
