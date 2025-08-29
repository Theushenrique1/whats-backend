// src/controllers/SyncController.js
const axios = require("axios");

const SyncController = {
  async sincronizar(req, res) {
    try {
      const resposta = await axios.get("https://whapi.cloud/api/messages", {
        headers: {
          Authorization: `Bearer ${process.env.WHAPI_TOKEN}`,
        },
      });

      const mensagens = resposta.data;

      console.log("📥 Mensagens sincronizadas:");
      console.log(mensagens);

      // Aqui você pode salvar no banco se quiser

      return res
        .status(200)
        .json({ sucesso: true, quantidade: mensagens.length });
    } catch (erro) {
      console.error("❌ Erro na sincronização:", erro.message);
      return res.status(500).json({ erro: "Erro ao sincronizar mensagens" });
    }
  },
};

module.exports = SyncController;
