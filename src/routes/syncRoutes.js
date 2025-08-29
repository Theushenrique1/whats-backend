// src/routes/syncRoutes.js
const express = require("express");
const { fetchMessages } = require("../services/whapiSync");
const router = express.Router();

router.post("/sync/messages", async (req, res, next) => {
  try {
    const { chatId, since, until } = req.body || {};
    const total = await fetchMessages({
      chatId,
      since: since ? new Date(since).getTime() : undefined,
      until: until ? new Date(until).getTime() : undefined,
    });
    res.json({ sucesso: true, total });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
