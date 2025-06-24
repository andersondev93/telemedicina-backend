import bcrypt from 'bcrypt';
import prisma from '../config/prismaClient.js';

export async function atualizarPerfil(req, res) {
  const usuarioId = req.usuarioId; 
  const { nome, email, senha } = req.body;

  try {
    const dadosAtualizados = {
      ...(nome && { nome }),
      ...(email && { email }),
    };

    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: usuarioId },
      data: dadosAtualizados,
      select: {
        id: true,
        nome: true,
        email: true,
        role: true,
      },
    });

    res.json({ message: 'Perfil atualizado com sucesso', usuario: usuarioAtualizado });
  } catch (error) {
    console.error('Erro ao atualizar perfil:', error);
    res.status(400).json({ error: 'Erro ao atualizar perfil' });
  }
}
