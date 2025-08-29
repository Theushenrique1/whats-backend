const db = require("../database/db");

async function criar({
  conteudo,
  data_envio,
  tipo_mensagem,
  grupo_id,
  usuario_id,
}) {
  const sql = `
    INSERT INTO mensagens (id, conteudo, data_envio, tipo_mensagem, grupo_id, usuario_id)
    VALUES (gen_random_uuid(), $1, to_timestamp($2), $3, $4, $5)
    RETURNING *;
  `;

  // data_envio esperado em segundos (Webhooks geralmente mandam em segundos).
  const ts = Number(data_envio) || Math.floor(Date.now() / 1000);
  const tipo = tipo_mensagem || "texto";

  const params = [conteudo || "", ts, tipo, grupo_id, usuario_id];
  const { rows } = await db.query(sql, params);
  return rows[0];
}

module.exports = { criar };
