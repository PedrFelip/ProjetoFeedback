const espress = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');


const app = espress();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const db = new sqlite3.Database('feedback.db', (err) => {
  if (err) {
    console.error('erro ao abrir o db ' + err.message);
  } else {
    db.run(`CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      email TEXT NOT NULL,
      feedback TEXT NOT NULL
    )`, (err) => {
      if (err) {
        console.error('erro ao criar tabela ' + err.message);
      }
    });
  }
});
//rota para cadastrar usuario
app.post('/cadastro', (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).json({
      error: 'Todos os campos são obrigatórios.'
    });
  }
  const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;
  db.run(sql, [nome, email, senha], function(err) {
    if (err) {
      console.error('Erro ao inserir usuário: ' + err.message);
      return res.status(500).json({
        error: 'Erro ao salvar usuário.'
      });
    }

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso.',
      id: this.lastID
    });
  });
});


    
app.post('/api/feedback', (req, res) => {
  const { nome, email, feedback } = req.body;

  if (!nome || !email || !feedback) {
    return res.status(400).json({
      error: 'Todos os campos são obrigatórios.'
    });
    const sql = `INSERT INTO feedback (nome, email, feedback) VALUES (?, ?, ?)`;

  db.run(sql, [nome, email, feedback], function(err) {
    if (err) {
      console.error('Erro ao inserir feedback: ' + err.message);
      return res.status(500).json({
        error: 'Erro ao salvar feedback.'
      });
    }
    res.status(201).json({
      message: 'Feedback salvo com sucesso.',
      id: this.lastID
    });

  });
  }
});


app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});