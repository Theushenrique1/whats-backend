

// 1. Importa a aplicação já configurada no app.js
const app = require('./src/app');

// 2. Define a porta (usa a do .env ou padrão 3333)
const PORT = process.env.PORT || 3333;

// 3. Inicia o servidor escutando nessa porta
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
