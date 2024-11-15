import express from 'express';
import { signup, login, forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Rotte per la registrazione, login e recupero della password
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);  // Nuova rotta per recupero password
router.post('/reset-password/:token', resetPassword);  // Nuova rotta per reset password

export default router;
