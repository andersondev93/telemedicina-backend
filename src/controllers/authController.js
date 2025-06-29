import prisma from '../config/prismaClient.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Apenas PACIENTES podem se cadastrar via essa rota
export async function cadastro(req, res) {
  const { nome, email, senha, role } = req.body;

  try {
    // Se o role for diferente de PACIENTE, bloquear
    if (role && role !== 'PACIENTE') {
      return res.status(403).json({ error: 'Você só pode se cadastrar como PACIENTE' });
    }

    // Verifica se já existe usuário com esse e-mail
    const existe = await prisma.usuario.findUnique({ where: { email } });
    if (existe) {
      return res.status(400).json({ error: 'E-mail já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        role: 'PACIENTE',
      },
    });

    res.status(201).json({ message: 'Paciente registrado com sucesso', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao registrar paciente' });
  }
}

// Login para todos os tipos de usuários
export async function login(req, res) {
  const { email, senha } = req.body;

  try {
    const user = await prisma.usuario.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro ao realizar login' });
  }
}
