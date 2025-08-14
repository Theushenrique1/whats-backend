
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async listar() {
    const result = await db.query('SELECT * FROM usuarios ORDER BY criado_em DESC');
    return result.rows;
  },

  async criar({ nome, numero }) {
    const id = uuidv4();
    const result = await db.query(
      'INSERT INTO usuarios (id, nome, numero) VALUES ($1, $2, $3) RETURNING *',
      [id, nome, numero]
    );
    return result.rows[0];
  }
};
