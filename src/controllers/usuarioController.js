import prisma from '../config/prismaClient.js';
import bcrypt from 'bcryptjs';

export async function atualizarPerfil(req, res) {
  const { nome, email, senha } = req.body;
  const userId = req.user?.id;
 
if (!userId) {
    return res.status(401).json({ error: 'Usuário não autenticado' });
  }


  try {
    const dadosAtualizados = {
      ...(nome && { nome }),
      ...(email && { email }),
    };

    if (senha) {
      dadosAtualizados.senha = await bcrypt.hash(senha, 10);
    }

    const usuarioAtualizado = await prisma.usuario.update({
      where: { id: userId },
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
