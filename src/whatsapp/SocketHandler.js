const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const path = require('path');

// 🔐 Caminho para a pasta onde os dados de autenticação ficarão salvos
const authFolderPath = path.join(__dirname, 'auth');

async function startSocket() {
  const { state, saveCreds } = await useMultiFileAuthState(authFolderPath);

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // Desabilita QR automático, usamos o qrcode-terminal
  });

  // 🔄 Atualizações de conexão
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      console.log('📲 QR Code gerado! Escaneie com o WhatsApp');
      qrcode.generate(qr, { small: true });
    }

    if (connection === 'close') {
      const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log('🔌 Conexão encerrada.', { shouldReconnect });
      if (shouldReconnect) startSocket();
      else console.log('🚫 Sessão encerrada permanentemente. Escaneie novamente o QR code.');
    }

    if (connection === 'open') {
      console.log('✅ Conectado ao WhatsApp com sucesso!');
    }
  });

  // 💾 Sempre salvar as credenciais quando necessário
  sock.ev.on('creds.update', saveCreds);

  // 📥 Escuta por mensagens novas
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    const msg = messages[0];
    if (!msg.key.fromMe && msg.message?.conversation) {
      const remetente = msg.pushName || 'Usuário';
      const texto = msg.message.conversation;
      console.log(`💬 Mensagem recebida de ${remetente}: ${texto}`);
      // Aqui você pode enviar para a API ou salvar no banco
    }
  });
}

module.exports = { startSocket };
