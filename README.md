# 🚀 Telemedicina Backend

Bem-vindo ao **Telemedicina Backend**!  
Esta é a API responsável por gerenciar usuários, médicos, consultas e autenticação de uma plataforma moderna de telemedicina.

---

## 🛠️ Tecnologias Utilizadas

- **Node.js**
- **Express**
- **Prisma ORM**
- **JWT** (autenticação)
- **bcryptjs**
- **dotenv**
- **CORS**

---

## ⚡ Como rodar localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/andersondev93/telemedicina-backend.git
   cd telemedicina-backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   - Crie um arquivo `.env` na raiz do projeto com:
     ```
     DATABASE_URL="sua_string_de_conexao"
     JWT_SECRET="sua_chave_secreta"
     ```

4. **Rode as migrations do Prisma**
   ```bash
   npx prisma migrate dev
   ```

5. **Inicie o servidor**
   ```bash
   npm run dev
   ```

---

## 📚 Principais Rotas

| Método | Rota                        | Descrição                     |
|--------|-----------------------------|-------------------------------|
| POST   | `/api/auth/login`           | Login de usuário              |
| POST   | `/api/auth/cadastro`        | Cadastro de usuário           |
| GET    | `/api/consultas/minhas`     | Listar consultas              |
| POST   | `/api/consultas/agendar`    | Agendar consulta              |
| GET    | `/api/admin/usuarios`       | Listar usuários (admin)       |
| POST   | `/api/admin/medicos`        | Cadastrar médico (admin)      |

---

## ☁️ Deploy na Vercel

- O projeto está pronto para deploy na [Vercel](https://vercel.com/).
- Não esqueça de configurar as variáveis de ambiente no painel da Vercel.

---

## 💡 Contribuição

Sinta-se à vontade para abrir issues, enviar PRs ou sugerir melhorias!

---

Feito com 💙 para a trilha de backend.