const express = require("express");
const cors = require("cors");
const app = express();
const whapiRoutes = require("./routes/whapi.routes");
app.use("/whatsapp", whapiRoutes);

// Força conexão com o banco
require("./config/db");

//app.use("/whatsapp", whapiRoutes); //rota para o whapi

app.use(cors());
app.use(express.json());

// Rotas
const usuarioRoutes = require("./routes/usuarioRoutes");
const grupoRoutes = require("./routes/grupoRoutes");
const grupoUsuarioRoutes = require("./routes/grupoUsuarioRoutes");
const mensagemRoutes = require("./routes/mensagemRoutes");

app.use("/usuarios", usuarioRoutes);
app.use("/grupos", grupoRoutes);
app.use("/grupo-usuarios", grupoUsuarioRoutes);
app.use("/mensagens", mensagemRoutes);

// Rota de teste
app.get("/", (req, res) => {
  res.send("API WhatsApp rodando!");
});

module.exports = app;
