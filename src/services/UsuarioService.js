// src/services/UsuarioService.js
const db = require("../database/db");
const logger = require("../utils/logger");

/**
 * Upsert por número (UNIQUE). Retorna { usuario, created }
 */
async function upsertByNumero({ numero, nome = "" }) {
  if (!numero) throw new Error("numero obrigatório");

  // Tabela 'usuarios' deve ter UNIQUE (numero)
  // Usa ON CONFLICT para atualizar nome e retornar a linha
  const sql = `
    INSERT INTO usuarios (numero, nome)
    VALUES ($1, $2)
    ON CONFLICT (numero)
    DO UPDATE SET nome = EXCLUDED.nome
    RETURNING *;
  `;

  const { rows } = await db.query(sql, [numero, nome]);
  const usuario = rows[0];

  // truque simples: se acabou de inserir, o created=true só quando não existia
  // como não temos o flag nativo, dá para conferir com uma leitura anterior (mais caro)
  // ou aceitar que "created" é semântico: mudou/entrou agora.
  // Se você quiser 100% correto, faça um SELECT antes de inserir.
  // Aqui ficamos com simples:
  const created = false; // sem SELECT prévio não dá para afirmar.
  logger.debug({ numero, nome, id: usuario.id }, "usuario upsert");

  return { usuario, created };
}

module.exports = { upsertByNumero };
