const axios = require("axios");

const WHAPI_TOKEN = process.env.WHAPI_TOKEN;
const WHAPI_URL = process.env.WHAPI_URL;

const api = axios.create({
  baseURL: WHAPI_URL,
  headers: {
    Authorization: `Bearer ${WHAPI_TOKEN}`,
    "Content-Type": "application/json",
  },
});

// Exemplo: enviar mensagem
const sendMessage = async (to, message) => {
  return await api.post("/messages/text", {
    to,
    body: message,
  });
};

module.exports = {
  sendMessage,
};
