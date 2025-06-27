import prisma from '../config/prismaClient.js';

// Agendar consulta (Paciente)
export async function agendarConsulta(req, res) {
  const pacienteId = req.user.id; // vem do middleware JWT
  const { medicoId, dataHora } = req.body;

  try {
    // Verifica se a disponibilidade existe
    const disponibilidade = await prisma.disponibilidade.findFirst({
      where: {
        medicoId: Number(medicoId),
        dataHora: new Date(dataHora),
      },
    });

    if (!disponibilidade) {
      return res.status(400).json({ error: 'Essa data/hora não está disponível para o médico.' });
    }

    // Cria a consulta
    const consulta = await prisma.consulta.create({
      data: {
        pacienteId,
        medicoId: Number(medicoId),
        dataHora: new Date(dataHora),
      },
    });

    // (Opcional) Remove a disponibilidade agendada
    await prisma.disponibilidade.delete({
      where: { id: disponibilidade.id },
    });

    res.status(201).json({ message: 'Consulta agendada com sucesso', consulta });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao agendar consulta' });
  }
}

export async function listarDisponibilidades(req, res) {
  const { medicoId } = req.params;

  try {
    const disponibilidades = await prisma.disponibilidade.findMany({
      where: { medicoId: Number(medicoId) },
      orderBy: { dataHora: 'asc' },
    });

    res.json(disponibilidades);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar disponibilidades' });
  }
}

export async function listarMedicos(req, res) {
  try {
    const medicos = await prisma.medico.findMany({
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            role: true,
          },
        },
        especialidade: true,
        disponibilidades: true,
      },
    });

    res.json(medicos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar médicos' });
  }
}

export async function listarConsultasDoPaciente(req, res) {
  const pacienteId = req.user.id;

  try {
    const consultas = await prisma.consulta.findMany({
      where: { pacienteId },
      include: {
        medico: {
          include: {
            usuario: {
              select: { nome: true, email: true }
            }
          }
        }
      },
      orderBy: { dataHora: 'asc' },
    });

    res.json(consultas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar consultas' });
  }
}

export async function cancelarConsulta(req, res) {
  const pacienteId = req.user.id;
  const consultaId = Number(req.params.id);

  try {
    const consulta = await prisma.consulta.findUnique({
      where: { id: consultaId },
    });

    if (!consulta || consulta.pacienteId !== pacienteId) {
      return res.status(403).json({ error: 'Você não tem permissão para cancelar essa consulta.' });
    }

    await prisma.consulta.delete({
      where: { id: consultaId },
    });

    res.json({ message: 'Consulta cancelada com sucesso.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cancelar consulta' });
  }
}

// Listar consultas para o médico logado
export async function listarConsultasDoMedico(req, res) {
  const usuarioId = req.user.id;

  try {
    // Busca o médico pelo ID do usuário logado
    const medico = await prisma.medico.findUnique({
      where: { usuarioId },
    });

    if (!medico) {
      return res.status(403).json({ error: 'Acesso restrito a médicos.' });
    }

    const consultas = await prisma.consulta.findMany({
      where: { medicoId: medico.id },
      include: {
        paciente: {
          select: { nome: true, email: true }
        }
      },
      orderBy: { dataHora: 'asc' },
    });

    res.json(consultas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar consultas do médico' });
  }
}
