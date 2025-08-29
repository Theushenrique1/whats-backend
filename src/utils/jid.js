function limparNumero(jidOuNumero) {
  if (!jidOuNumero) return null;
  return String(jidOuNumero)
    .replace("@s.whatsapp.net", "")
    .replace("@whatsapp.net", "")
    .replace(/[^\d]/g, "");
}

function isGrupo(jid) {
  return typeof jid === "string" && jid.endsWith("@g.us");
}

module.exports = { limparNumero, isGrupo };
