import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import config from '../config/config.js';

export const protect = async (req, res, next) => {
  let token;

  // Controllo se esiste l'header di authorization contenente il token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Estraggo il token
      token = req.headers.authorization.split(' ')[1];

      // Controllo se il token è valido
      const decoded = jwt.verify(token, config.jwtSecret);

      // Trovo lo userID associato
      req.user = await User.findById(decoded.id).select('-password');

      next(); 
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};
