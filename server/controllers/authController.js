import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';

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
    // Trova l'utente con il nome
    const user = await User.findOne({ email }); 
    if (!user) {
      return res.status(400).json({ message: 'Email o password errati.' });
    }

    // Confronta la password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Email o password errati.' });
    }

    // Genera un token JWT
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
