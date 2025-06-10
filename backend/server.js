const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'database', 'feedback.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Erro ao conectar:", err.message);
  else console.log("✅ Banco de dados conectado.");
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT, endereco TEXT, email TEXT,
    username TEXT UNIQUE, password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER,
    mensagem TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
  )`);
});

app.post('/cadastro', (req, res) => {
  const { nome, endereco, email, username, password } = req.body;
  const query = `INSERT INTO usuarios (nome, endereco, email, username, password) VALUES (?, ?, ?, ?, ?)`;

  db.run(query, [nome, endereco, email, username, password], function(err) {
    if (err) return res.json({ sucesso: false, mensagem: 'Usuário já existe ou erro ao cadastrar.' });
    res.json({ sucesso: true, mensagem: 'Cadastro realizado com sucesso!' });
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = `SELECT * FROM usuarios WHERE username = ? AND password = ?`;

  db.get(query, [username, password], (err, row) => {
    if (err || !row) return res.json({ sucesso: false, mensagem: 'Login inválido.' });
    res.json({ sucesso: true, mensagem: 'Login bem-sucedido', userId: row.id });
  });
});

app.post('/feedback', (req, res) => {
  const { usuario_id, mensagem } = req.body;
  const query = `INSERT INTO feedbacks (usuario_id, mensagem) VALUES (?, ?)`;

  db.run(query, [usuario_id, mensagem], function(err) {
    if (err) return res.json({ sucesso: false, mensagem: 'Erro ao enviar feedback.' });
    res.json({ sucesso: true, mensagem: 'Feedback enviado com sucesso!' });
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});