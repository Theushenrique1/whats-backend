// src/app.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const logger = require("./utils/logger");

// ----- inicialização -----
const app = express();

// confia no proxy (ngrok, load balancer etc.) para ip correto
app.set("trust proxy", true);

// 1) Middlewares globais
app.use(cors());

// guarda o corpo “cru” (raw) para futura verificação de assinatura do Whapi, se precisar.
// mantém também o parse JSON normal.
app.use(
  express.json({
    limit: "2mb",
    verify: (req, res, buf) => {
      try {
        req.rawBody = buf ? buf.toString("utf8") : "";
      } catch {
        req.rawBody = "";
      }
    },
  }),
);

// middleware simples de access log (tempo de resposta e status)
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    logger.info(
      {
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        ms: Date.now() - start,
      },
      "http",
    );
  });
  next();
});

// 2) (opcional) força conexão ao banco (mantenha como já estava)
require("./database/db");

// 3) IMPORTE SUAS ROTAS AQUI
const webhookRoutes = require("./routes/webhook");
const usuarioRoutes = require("./routes/usuarioRoutes");
const grupoRoutes = require("./routes/grupoRoutes");
const grupoUsuarioRoutes = require("./routes/grupoUsuarioRoutes");
const mensagemRoutes = require("./routes/mensagemRoutes");
const syncRoutes = require("./routes/syncRoutes");

// 4) REGISTRE AS ROTAS AQUI
// OBS: coloquei o webhook primeiro só por organização; funcionalmente não precisa, mas ajuda a achar logs.
app.use("/webhook", webhookRoutes); // <- Whapi aponta pra cá
app.use("/usuarios", usuarioRoutes);
app.use("/grupos", grupoRoutes);
app.use("/grupo-usuarios", grupoUsuarioRoutes);
app.use("/mensagens", mensagemRoutes);
app.use("/whapi", syncRoutes);

// 5) Rotas simples de verificação
app.get("/", (req, res) => res.send("API WhatsApp rodando!"));
app.get("/healthz", (req, res) => res.status(200).json({ ok: true }));

// 6) 404 handler (quando nenhuma rota casa)
app.use((req, res, next) => {
  logger.warn(
    { method: req.method, path: req.originalUrl },
    "rota não encontrada (404)",
  );
  res.status(404).json({ sucesso: false, erro: "Rota não encontrada" });
});

// 7) Handler global de erro — DEIXE POR ÚLTIMO
app.use((err, req, res, next) => {
  logger.error({ err }, "erro não tratado");
  if (res.headersSent) return next(err);
  res.status(500).json({ sucesso: false, erro: err.message || "Erro" });
});

module.exports = app;
