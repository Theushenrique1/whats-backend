

//  Importando o Express
const express = require('express');

//  Importando o CORS para permitir requisições externas
const cors = require('cors');

//  Criando a aplicação Express
const app = express();

const usuarioRoutes = require('./routes/usuarioRoutes');
const grupoRoutes = require('./routes/grupoRoutes');
const grupoUsuarioRoutes = require('./routes/grupoUsuarioRoutes');
const mensagemRoutes = require('./routes/mensagemRoutes');

//  Importando variáveis do arquivo .env
require('dotenv').config();

// forçar conexão 
require('./config/db');


//  Usando o CORS para liberar a API para outros domínios
app.use(cors());

//  Habilitando a API a receber dados em JSON
app.use(express.json());

app.use('/usuarios', usuarioRoutes);
app.use('/grupos', grupoRoutes);
app.use('/grupo-usuarios', grupoUsuarioRoutes);
app.use('/mensagens', mensagemRoutes);


//  Rota de teste para verificar se está funcionando
app.get('/', (req, res) => {
  res.send('API SaaS WhatsApp rodando!');
});

//  Exportando o app para ser usado em outro arquivo (server.js)
module.exports = app;

