import express from 'express';
import { listarUsuarios, cadastrarMedico, atualizarUsuario, deletarUsuario, atualizarMedico, deletarMedico, listarMedicos } from '../controllers/adminController.js';
import { autenticarToken, verificarAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/usuarios', autenticarToken, verificarAdmin, listarUsuarios);
router.put('/usuarios/:id', autenticarToken, verificarAdmin, atualizarUsuario);
router.delete('/usuarios/:id', autenticarToken, verificarAdmin, deletarUsuario);

router.get('/listamedicos', autenticarToken, verificarAdmin, listarMedicos);
router.post('/medicos', autenticarToken, verificarAdmin, cadastrarMedico);
router.put('/medicos/:id', autenticarToken, verificarAdmin, atualizarMedico);
router.delete('/medicos/:id', autenticarToken, verificarAdmin, deletarMedico);

export default router;
