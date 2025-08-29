const db = require("../database/db");
const { v4: uuidv4 } = require("uuid");

module.exports = {
  async listar() {
    const result = await db.query(`
      SELECT grupo_usuarios.*, usuarios.nome AS usuario_nome, grupos.nome AS grupo_nome
      FROM grupo_usuarios
      JOIN usuarios ON grupo_usuarios.usuario_id = usuarios.id
      JOIN grupos ON grupo_usuarios.grupo_id = grupos.id
      ORDER BY grupo_usuarios.data_entrada DESC
    `);
    return result.rows;
  },

  async criar({ grupo_id, usuario_id }) {
    const id = uuidv4();
    const result = await db.query(
      `INSERT INTO grupo_usuarios (id, grupo_id, usuario_id)
       VALUES ($1, $2, $3) RETURNING *`,
      [id, grupo_id, usuario_id],
    );
    return result.rows[0];
  },
};
