import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import consultaRoutes from './routes/consultaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000',                 
}));


app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/usuario', usuarioRoutes);

export default app;
