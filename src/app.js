

const express = require('express');
const cors = require('cors');
const app = express();

// Importa variáveis de ambiente
require('dotenv').config();

// Força conexão com o banco
require('./config/db');

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
const usuarioRoutes = require('./routes/usuarioRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const grupoUsuarioRoutes = require('./routes/grupoUsuarioRoutes');
const mensagemRoutes = require('./routes/mensagemRoutes');

app.use('/usuarios', usuarioRoutes);
app.use('/grupos', grupoRoutes);
app.use('/grupo-usuarios', grupoUsuarioRoutes);
app.use('/mensagens', mensagemRoutes);

// Rota de teste
app.get('/', (req, res) => {
  res.send('API SaaS WhatsApp rodando!');
});

module.exports = app;
