import express from 'express';
import { atualizarPerfil } from '../controllers/usuarioController.js';
import { autenticarToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.put('/perfil', autenticarToken, atualizarPerfil);

export default router;
