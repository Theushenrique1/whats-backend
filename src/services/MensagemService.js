const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  // Lista todas as mensagens com o nome do grupo e do usuário
  async listar() {
    const result = await db.query(`
      SELECT m.*, u.nome AS usuario_nome, g.nome AS grupo_nome
      FROM mensagens m
      JOIN usuarios u ON m.usuario_id = u.id
      JOIN grupos g ON m.grupo_id = g.id
      ORDER BY m.data_envio DESC
    `);
    return result.rows;
  },

  // Cria uma nova mensagem e atualiza o contador do grupo
  async criar({ conteudo, data_envio, tipo_mensagem, grupo_id, usuario_id }) {
    const id = uuidv4();

    // Insere a nova mensagem no banco
    const result = await db.query(
      `INSERT INTO mensagens (
         id, conteudo, data_envio, tipo_mensagem, grupo_id, usuario_id
       ) VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, conteudo, data_envio, tipo_mensagem, grupo_id, usuario_id]
    );

    // Atualiza a quantidade de mensagens no grupo relacionado
    await db.query(
      `UPDATE grupos
       SET quantidade_mensagens = quantidade_mensagens + 1
       WHERE id = $1`,
      [grupo_id]
    );

    return result.rows[0];
  }
};
