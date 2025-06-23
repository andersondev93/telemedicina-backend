import express from 'express';
import { agendarConsulta } from '../controllers/consultaController.js';
import { autenticarToken, verificarPaciente, verificarMedico } from '../middlewares/authMiddleware.js';
import { listarDisponibilidades } from '../controllers/consultaController.js';
import { listarConsultasDoPaciente } from '../controllers/consultaController.js';
import { cancelarConsulta } from '../controllers/consultaController.js';
import { listarConsultasDoMedico } from '../controllers/consultaController.js';


const router = express.Router();

router.post('/agendar', autenticarToken, verificarPaciente, agendarConsulta);
router.get('/disponibilidades/:medicoId', listarDisponibilidades);
router.get('/minhas', autenticarToken, verificarPaciente, listarConsultasDoPaciente);
router.delete('/cancelar/:id', autenticarToken, verificarPaciente, cancelarConsulta);
router.get('/medico', autenticarToken, verificarMedico, listarConsultasDoMedico);

export default router;
