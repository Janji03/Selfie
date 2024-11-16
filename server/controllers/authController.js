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

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'Utente non trovato.' });
    }

    // Genera un token per il reset della password
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minuti
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io', // Host fornito
      port: 2525, // Porta consigliata
      auth: {
        user: config.mailtrapUser, // Username dal file di configurazione
        pass: config.mailtrapPass, // Password dal file di configurazione
      },
    });

    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    // Invia l'email con HTML
    await transporter.sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <p>Hai richiesto di resettare la tua password.</p>
        <p>Clicca sul link sottostante per resettare la tua password:</p>
        <a href="${resetURL}" style="color: blue; text-decoration: underline;">Resetta la password</a>
        <p>Se non hai richiesto questa operazione, ignora questa email.</p>
      `,
    });

    res.status(200).json({ message: 'Email inviata con successo!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server.' });
  }
};


// Funzione per resettare la password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token non valido o scaduto.' });
    }

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password aggiornata con successo!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Errore del server.' });
  }
};