import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import consultaRoutes from './routes/consultaRoutes.js';
import usuarioRoutes from './routes/usuarioRoutes.js';
import cookieParser from 'cookie-parser';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser()); 
app.use(cors({
  origin: 'http://localhost:3000', 
  credentials: true,                 
}));

// Exemplo middleware que verifica cookie/sessão
app.use((req, res, next) => {
  console.log('Cookies:', req.cookies); // Veja se cookie aparece
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/consultas', consultaRoutes);
app.use('/api/usuario', usuarioRoutes);

export default app;
