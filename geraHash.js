const bcrypt = await import('bcryptjs');

async function gerarHash() {
  const senha = 'admin123'; // Altere para a senha que quiser
  const hash = await bcrypt.hash(senha, 10);
  console.log('Hash gerado:', hash);
}

gerarHash();
