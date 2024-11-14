import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 
import config from './config/config.js';

const app = express();

connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

// Registrazione delle rotte
app.use('/api/auth', authRoutes);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
