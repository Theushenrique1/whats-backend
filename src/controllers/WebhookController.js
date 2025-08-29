/**
 * WebhookController
 * ------------------
 * Responsável por receber os eventos do Whapi:
 *  - /webhook/messages/post : novas mensagens recebidas/enviadas
 *  - /webhook/chats/post    : atualizações de chats (ex.: grupos)
 *
 * Regras que seguimos aqui:
 *  1) Idempotência: nunca duplicar grupo/usuário.
 *     (delegado aos services com UPSERT por chave única)
 *  2) Só LOGAMOS "novo grupo criado" se realmente foi inserido agora.
 *  3) Logs limpos:
 *     - logger.info  => eventos importantes (mensagem gravada, novo grupo)
 *     - logger.debug => payload bruto (aparece apenas se LOG_LEVEL=debug)
 */

const logger = require("../utils/logger");
const MensagemService = require("../services/MensagemService");
const { upsertByNumero } = require("../services/UsuarioService");
const { upsertByJid } = require("../services/GrupoService");

/* ========================================================================== */
/*                                 Helpers                                    */
/* ========================================================================== */

/** Remove o sufixo @s.whatsapp.net, caso exista */
function normalizaNumero(n) {
  if (!n) return n;
  return n.replace(/@s\.whatsapp\.net$/i, "");
}

/** Diz se um chat_id é de grupo (termina com @g.us) */
function isGroupChatId(chatId) {
  return typeof chatId === "string" && /@g\.us$/i.test(chatId);
}

/** Converte timestamp (em segundos) do Whapi para Date */
function tsToDate(ts) {
  // alguns payloads chegam com timestamp em segundos; se vier Date/ISO, o new Date cuida
  if (typeof ts === "number") return new Date(ts * 1000);
  return ts ? new Date(ts) : new Date();
}

/* ========================================================================== */
/*                            /webhook/messages/post                          */
/* ========================================================================== */

/**
 * Recebe novas mensagens do Whapi.
 * O payload padrão é:
 * {
 *   "messages":[
 *     {
 *       "id": "...",
 *       "type": "text",
 *       "chat_id": "1203...@g.us" | "5511...@s.whatsapp.net",
 *       "timestamp": 1756413559,
 *       "text": { "body": "conteúdo ..." },
 *       "from": "5511999999999",
 *       "from_name": "Matheus Henrique"
 *     }
 *   ],
 *   "channel_id": "XXXXXX"
 * }
 */
async function receberMensagem(req, res, next) {
  try {
    const arr = Array.isArray(req.body?.messages) ? req.body.messages : [];

    if (arr.length === 0) {
      logger.warn({ body: req.body }, "messages: payload vazio");
      return res.status(200).json({ sucesso: true });
    }

    // payload completo só em debug para não poluir o console
    logger.debug({ raw: req.body }, "messages: payload bruto");

    // processa cada item isoladamente; se uma falhar, as outras seguem
    for (const m of arr) {
      try {
        const chatId = m.chat_id; // id do chat (pode ser grupo ou privado)
        const texto = m.text?.body ?? ""; // conteúdo da mensagem (se for 'text')
        const from = normalizaNumero(m.from); // número do remetente
        const fromName = m.from_name || ""; // nome do remetente (se disponível)
        const tipo = m.type || "texto"; // tipo (text, image, etc.)
        const dataEnv = tsToDate(m.timestamp); // data/hora

        // 1) Usuário (upsert por número)
        const { usuario } = await upsertByNumero({
          numero: from,
          nome: fromName,
        });

        // 2) Grupo (se a mensagem pertence a um grupo)
        let grupo = null;
        if (isGroupChatId(chatId)) {
          const { grupo: g, created } = await upsertByJid({
            jid: chatId,
            // nome do grupo geralmente vem em /chats; aqui deixamos null
            nome: null,
          });
          grupo = g;

          // só loga se realmente criou agora
          if (created) {
            logger.info(
              { jid: chatId, id: grupo.id, nome: grupo.nome || null },
              "novo grupo criado",
            );
          }
        }

        // 3) Gravar a mensagem (mensagens privadas têm grupo_id = null)
        const msg = await MensagemService.criar({
          usuario_id: usuario.id,
          grupo_id: grupo ? grupo.id : null,
          conteudo: texto,
          de_jid: `${from}@s.whatsapp.net`,
          para_jid: chatId,
          data_envio: dataEnv,
          tipo_mensagem: tipo,
        });

        logger.info(
          {
            id: msg.id,
            usuario_id: usuario.id,
            grupo_id: grupo ? grupo.id : null,
            chat_id: chatId,
            texto,
          },
          "mensagem gravada no banco",
        );
      } catch (errItem) {
        // não para o lote; loga e segue
        logger.error(
          { err: errItem, item: m },
          "erro ao processar item em /messages",
        );
      }
    }

    return res.status(200).json({ sucesso: true });
  } catch (err) {
    // erro inesperado do lote inteiro
    logger.error({ err }, "erro em receberMensagem");
    return next(err);
  }
}

/* ========================================================================== */
/*                              /webhook/chats/post                           */
/* ========================================================================== */

/**
 * Recebe atualizações de chats (principalmente grupos) do Whapi.
 * Estrutura comum:
 * {
 *   "chats_updates": [
 *     {
 *       "before_update": { ... },
 *       "after_update":  { ... }   // usar esse quando existir
 *     }
 *   ]
 * }
 */
async function receberChats(req, res, next) {
  try {
    const updates = Array.isArray(req.body?.chats_updates)
      ? req.body.chats_updates
      : [];

    if (updates.length === 0) {
      logger.warn({ body: req.body }, "chats: payload vazio");
      return res.status(200).json({ sucesso: true });
    }

    // payload completo só em debug
    logger.debug({ raw: req.body }, "chats: payload bruto");

    for (const u of updates) {
      try {
        // prioriza "after_update"; se não existir, usa "before_update"
        const chat = u.after_update || u.before_update || {};
        if (chat.type !== "group") continue; // só nos importam grupos

        const jid = chat.id; // ex.: 1203...@g.us
        const nome = chat.name || null; // nome, quando informado

        const { grupo, created } = await upsertByJid({ jid, nome });

        if (created) {
          logger.info(
            { jid, id: grupo.id, nome: grupo.nome || null },
            "novo grupo criado",
          );
        } else if (nome && nome !== grupo.nome) {
          logger.info({ jid, id: grupo.id, nome }, "nome do grupo atualizado");
        }
      } catch (errItem) {
        logger.error(
          { err: errItem, item: u },
          "erro ao processar item em /chats",
        );
      }
    }

    return res.status(200).json({ sucesso: true });
  } catch (err) {
    logger.error({ err }, "erro em receberChats");
    return next(err);
  }
}

/* ========================================================================== */
/*                                   Export                                   */
/* ========================================================================== */

module.exports = {
  receberMensagem,
  receberChats,
};
