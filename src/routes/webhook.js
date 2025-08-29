// src/routes/webhook.js
const express = require("express");
const router = express.Router();

const WebhookController = require("../controllers/WebhookController");

// Se você tiver um middleware de assinatura/segurança do Whapi, coloque aqui.
// Ex.: router.use(validarAssinaturaWhapi);

// Endpoints usados pelo painel/config do Whapi:
router.post("/messages/post", WebhookController.receberMensagem);
router.post("/chats/post", WebhookController.receberChats);

module.exports = router;
