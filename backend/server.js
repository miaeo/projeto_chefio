// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const conexao = require('./db');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Rota de cadastro
app.post('/register', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ message: 'Preencha todos os campos.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);
    const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
    conexao.query(query, [nome, email, hashedPassword], (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar:', err);
        return res.status(500).json({ message: 'Erro ao cadastrar usuário.' });
      }

      res.status(200).json({ message: 'Cadastro realizado com sucesso!' });
    });
  } catch (error) {
    console.error('Erro ao hashear a senha:', error);
    res.status(500).json({ message: 'Erro interno do servidor.' });
  }
});

// Rota de login
app.post('/login', (req, res) => {
  const { email, senha } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  conexao.query(query, [email], async (err, results) => {
    if (err) {
      console.error('Erro no login:', err);
      return res.status(500).json({ message: 'Erro no servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ sucesso: false, message: 'Credenciais inválidas' });
    }

    const usuario = results[0];

    if(usuario.banido) {
      return res.status(403).json({
        sucesso: false,
        banido: true,
        message: 'Usuário banido',
        motivo: usuario.motivoBanimento || 'Sem motivo registrado'
      });
    }

    try {
      const senhaCorreta = await bcrypt.compare(senha, usuario.senha);

      if (senhaCorreta) {
        res.status(200).json({ sucesso: true, usuario });
      } else {
        res.status(401).json({ sucesso: false, message: 'Credenciais inválidas' });
      }
    } catch (error) {
      console.error('Erro ao comparar senha:', error);
      res.status(500).json({ message: 'Erro interno ao verificar senha' });
    }
  });
});

// Rota para listar todos os usuários (admin)
app.get('/usuarios', (req, res) => {
  const query = 'SELECT id, nome, email FROM usuarios WHERE id != 4 AND (banido = 0 OR banido IS NULL)';
  conexao.query(query, (err, results) => {
    if (err) {
      console.error('Erro ao buscar usuários:', err);
      return res.status(500).json({ message: 'Erro ao buscar usuários.' });
    }

    res.status(200).json(results);
  });
});

// Rota para atualizar status de banimento de um usuário
app.patch('/usuarios/:id', (req, res) => {
  const { id } = req.params;
  const { banido, motivoBanimento } = req.body;

  const query = 'UPDATE usuarios SET banido = ?, motivoBanimento = ? WHERE id = ?';
  conexao.query(query, [banido ? 1 : 0, motivoBanimento, id], (err, result) => {
    if (err) {
      console.error('Erro ao banir usuário:', err);
      return res.status(500).json({ message: 'Erro ao banir usuário' });
    }

    res.status(200).json({ message: 'Usuário banido com sucesso' });
  });
});


// Rota para emitir alerta para um usuário
app.patch('/usuarios/:id/alerta', (req, res) => {
  const { id } = req.params;
  const { alerta } = req.body;

  const query = 'UPDATE usuarios SET alerta = ? WHERE id = ?';
  conexao.query(query, [alerta, id], (err, result) => {
    if (err) {
      console.error('Erro ao emitir alerta:', err);
      return res.status(500).json({ message: 'Erro ao emitir alerta.' });
    }

    res.status(200).json({ message: 'Alerta enviado com sucesso.' });
  });
});

// Rota para buscar alerta do usuário
app.get('/usuarios/:id/alerta', (req, res) => {
  const { id } = req.params;

  const query = 'SELECT alerta FROM usuarios WHERE id = ?';
  conexao.query(query, [id], (err, results) => {
    if (err) {
      console.error('Erro ao buscar alerta:', err);
      return res.status(500).json({ message: 'Erro ao buscar alerta.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }

    const alerta = results[0].alerta;
    res.status(200).json({ alerta });
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
