
const db = require('../config/db');
// Importa a lib UUID para criar IDs únicos (usada no método de criar)
const { v4: uuidv4 } = require('uuid');

module.exports = {
  async listar() {
    const result = await db.query('SELECT * FROM grupos ORDER BY criado_em DESC');
    return result.rows;
  },


  async criar({ nome }) {
    const id = uuidv4();
    const result = await db.query(
      'INSERT INTO grupos (id, nome) VALUES ($1, $2) RETURNING *',
      [id, nome]
    );
    return result.rows[0];
  }
};
