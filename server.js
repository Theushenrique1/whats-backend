require("dotenv").config(); // Carrega .env
const app = require("./src/app"); // Importa a API

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
