import prisma from '../config/prismaClient.js';
import bcrypt from 'bcryptjs';

// Listar todos os usuários
export async function listarUsuarios(req, res) {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
}

// Cadastrar médico (admin)
export async function cadastrarMedico(req, res) {
  try {
    const { nome, email, senha, especialidadeNome, disponibilidades } = req.body;

    const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const usuario = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: senhaHash,
        role: 'MEDICO'
      }
    });

    // Cria ou conecta uma especialidade única
    const especialidade = await prisma.especialidade.upsert({
      where: { nome: especialidadeNome },
      update: {},
      create: { nome: especialidadeNome }
    });

    const medico = await prisma.medico.create({
      data: {
        usuarioId: usuario.id,
        especialidadeId: especialidade.id,
        disponibilidades: {
          create: disponibilidades // Ex: [{ dataHora: "2025-06-20T14:00:00.000Z" }]
        }
      },
      include: {
        especialidade: true,
        disponibilidades: true
      }
    });

    res.status(201).json({ message: 'Médico cadastrado com sucesso', medico });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao cadastrar médico' });
  }
}

export async function atualizarUsuario(req, res) {
  const { id } = req.params;
  const { nome, email, senha, role } = req.body;

  try {
    const dadosAtualizados = {
      ...(nome && { nome }),
      ...(email && { email }),
      ...(role && { role }),
    };

    if (senha) {
      const senhaHash = await bcrypt.hash(senha, 10);
      dadosAtualizados.senha = senhaHash;
    }

    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: dadosAtualizados,
    });

    res.json({ message: 'Usuário atualizado com sucesso', usuario });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao atualizar usuário' });
  }
}

export async function deletarUsuario(req, res) {
  const { id } = req.params;

  try {
    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao deletar usuário' });
  }
}

export async function atualizarMedico(req, res) {
  const { id } = req.params;
  const { nome, email, senha, especialidadeNome, disponibilidades } = req.body;

  try {
    const usuarioData = {
      ...(nome && { nome }),
      ...(email && { email }),
    };

    if (senha) {
      usuarioData.senha = await bcrypt.hash(senha, 10);
    }

    // Atualiza usuário
    const usuario = await prisma.usuario.update({
      where: { id: Number(id) },
      data: usuarioData,
    });

    // Atualiza especialidade se informado
    let especialidade;
    if (especialidadeNome) {
      especialidade = await prisma.especialidade.upsert({
        where: { nome: especialidadeNome },
        update: {},
        create: { nome: especialidadeNome },
      });

      await prisma.medico.update({
        where: { usuarioId: Number(id) },
        data: {
          especialidadeId: especialidade.id,
        },
      });
    }

    // Substitui as disponibilidades, se informadas
    if (disponibilidades) {
      const medico = await prisma.medico.findUnique({ where: { usuarioId: Number(id) } });

      await prisma.disponibilidade.deleteMany({
        where: { medicoId: medico.id },
      });

      await prisma.disponibilidade.createMany({
        data: disponibilidades.map((d) => ({
          medicoId: medico.id,
          dataHora: new Date(d.dataHora),
        })),
      });
    }

    res.json({ message: 'Médico atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao atualizar médico' });
  }
}

export async function deletarMedico(req, res) {
  const { id } = req.params;

  try {
    const medico = await prisma.medico.findUnique({
      where: { usuarioId: Number(id) },
    });

    if (!medico) {
      return res.status(404).json({ error: 'Médico não encontrado' });
    }

    // Deleta as disponibilidades do médico
    await prisma.disponibilidade.deleteMany({
      where: { medicoId: medico.id },
    });

    // Deleta o médico
    await prisma.medico.delete({
      where: { id: medico.id },
    });

    // Deleta o usuário vinculado
    await prisma.usuario.delete({
      where: { id: Number(id) },
    });

    res.json({ message: 'Médico deletado com sucesso' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Erro ao deletar médico' });
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