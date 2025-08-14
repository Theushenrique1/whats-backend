

// 1. Importa o Pool do pacote pg (PostgreSQL driver)
const { Pool } = require('pg');

// 2. Carrega variáveis do .env
require('dotenv').config();

// 3. Cria uma pool de conexões com os dados do .env
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});


// 4. Testa a conexão com o banco
pool.query('SELECT NOW()')
  .then(() => {
    console.log('🟢 Conectado ao banco  com sucesso!');
  })
  .catch((err) => {
    console.error('🔴 Erro ao conectar no banco:', err);
  });

// 5. Exporta a pool para usar em outros arquivos
module.exports = pool;
