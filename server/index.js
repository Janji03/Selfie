import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; 
import userRoutes from './routes/userRoutes.js';
import notesRoutes from './routes/notesRoutes.js';
import config from './config/config.js';

const app = express();

connectDB();

// Middlewares
app.use(express.json());
app.use(cors());

app.use('/uploads', express.static('./uploads'));

// Registrazione delle rotte
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', notesRoutes);

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
