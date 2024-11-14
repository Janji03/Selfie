import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// Rotte per la registrazione e il login
router.post('/signup', signup);
router.post('/login', login); 

export default router;
