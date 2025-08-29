// src/services/GrupoService.js
const db = require("../database/db");
const logger = require("../utils/logger");

/**
 * Upsert por JID. Retorna { grupo, created }
 * - created = true se inseriu agora
 * - created = false se já existia (ou só atualizou o nome)
 */
async function upsertByJid({ jid, nome = null }) {
  if (!jid) throw new Error("jid obrigatório");

  // Tabela 'grupos' deve ter UNIQUE (jid)
  // Estratégia: INSERT ... ON CONFLICT DO NOTHING RETURNING *
  // se não retornou nada, faz SELECT
  const insertSql = `
    INSERT INTO grupos (jid, nome)
    VALUES ($1, COALESCE($2, ''))
    ON CONFLICT (jid) DO NOTHING
    RETURNING *;
  `;

  const { rows: inserted } = await db.query(insertSql, [jid, nome]);

  if (inserted.length > 0) {
    logger.debug({ jid, nome }, "grupo inserido (upsert)");
    return { grupo: inserted[0], created: true };
  }

  // Já existia: busca
  const { rows } = await db.query("SELECT * FROM grupos WHERE jid = $1", [jid]);
  const grupo = rows[0];

  // se o nome veio agora e mudou, atualiza
  if (grupo && nome && nome !== grupo.nome) {
    const { rows: updated } = await db.query(
      "UPDATE grupos SET nome = $1 WHERE id = $2 RETURNING *;",
      [nome, grupo.id],
    );
    return { grupo: updated[0], created: false };
  }

  return { grupo, created: false };
}

module.exports = { upsertByJid };
