const express = require("express");
const router = express.Router();
const { sendMessage } = require("../services/whapiService");

router.post("/enviar", async (req, res) => {
  const { to, message } = req.body;
  try {
    const response = await sendMessage(to, message);
    res.status(200).json(response.data);
  } catch (err) {
    console.error(
      "[WHAPI] Erro ao enviar:",
      err?.response?.data || err.message,
    );
    res.status(500).json({ error: "Erro ao enviar mensagem" });
  }
});

module.exports = router;
