
const MensagemService = require('../services/MensagemService');

module.exports = {
  async listar(req, res) {
    try {
      const mensagens = await MensagemService.listar();
      res.json(mensagens);
    } catch (err) {
      console.error('[CONTROLLER] Erro ao listar mensagens:', err);
      res.status(500).json({ erro: 'Erro ao listar mensagens' });
    }
  },

  async criar(req, res) {
    try {
      const {
        conteudo,
        data_envio,
        tipo_mensagem,
        grupo_id,
        usuario_id
      } = req.body;

      const mensagem = await MensagemService.criar({
        conteudo,
        data_envio,
        tipo_mensagem,
        grupo_id,
        usuario_id
      });

      res.status(201).json(mensagem);
    } catch (err) {
      console.error('[CONTROLLER] Erro ao criar mensagem:', err);
      res.status(500).json({ erro: 'Erro ao criar mensagem' });
    }
  }
};
