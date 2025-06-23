import jwt from 'jsonwebtoken';

// Segredo para validar o token (deve ser uma variável de ambiente na prática)
const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoAqui';

// Middleware para autenticar o token JWT
export function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Token no formato "Bearer TOKEN"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token não fornecido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });

    req.user = user; // user deve ter id, email, role, etc conforme payload do token
    next();
  });
}

// Middleware para verificar se o usuário é admin
export function verificarAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Usuário não autenticado' });

  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ error: 'Acesso negado: admin somente' });
  }

  next();
}

export function verificarPaciente(req, res, next) {
  if (!req.user || req.user.role !== 'PACIENTE') {
    return res.status(403).json({ error: 'Acesso restrito a pacientes' });
  }
  next();
}

export function verificarMedico(req, res, next) {
  if (req.user.role !== 'MEDICO') {
    return res.status(403).json({ error: 'Acesso restrito a médicos' });
  }
  next();
}
