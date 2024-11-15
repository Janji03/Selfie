import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Funzione per registrare un nuovo utente
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Verifica se l'utente esiste già
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Utente già registrato con questa email.' });
    }
    
    // Crea un nuovo utente
    const user = new User({ name, email, password });
    await user.save();

    const userID = user._id;

    // Genera un token JWT
    const token = jwt.sign({ userId: userID }, config.jwtSecret, { expiresIn: '1h' });

    res.status(201).json({
      message: 'Utente registrato con successo!',
      token,
      userID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server.' });
  }
};

// Funzione per il login dell'utente
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email o password errati.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email o password errati.' });
    }

    const token = jwt.sign({ userId: user._id }, config.jwtSecret, { expiresIn: '1h' });
    const userID = user._id;

    res.status(200).json({
      message: 'Login effettuato con successo!',
      token,
      userID,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server.' });
  }
};

// Funzione per il recupero della password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email non trovata.' });
    }

    // Crea un token di reset e la scadenza
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiration = Date.now() + 3600000; // Scadenza in 1 ora

    user.resetToken = resetToken;
    user.resetTokenExpiration = resetTokenExpiration;
    await user.save();

    // Configura Mailtrap per l'invio delle email
 // Configura il trasportatore Nodemailer con Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io", // Host fornito da Mailtrap
  port: 25, // Usa una delle porte supportate (ad es. 2525)
  auth: {
    user: "3a22d62bd93905", // Inserisci il tuo username Mailtrap
    pass: "41587241b310cb", // Inserisci la tua password Mailtrap
  },
});


    const resetLink = `http://localhost:5000/api/auth/reset-password/${resetToken}`;

    await transporter.sendMail({
      to: email,
      subject: 'Reset della tua password',
      html: `<p>Clicca sul link per resettere la tua password: <a href="${resetLink}">Reset Password</a></p>`,
    });

    res.status(200).json({ message: 'Email inviata con successo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server.' });
  }
};

// Funzione per il reset della password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } });
    if (!user) {
      return res.status(400).json({ message: 'Token non valido o scaduto.' });
    }

    user.password = password;
    user.resetToken = undefined;
    user.resetTokenExpiration = undefined;
    await user.save();

    res.status(200).json({ message: 'Password aggiornata con successo.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server.' });
  }
};
