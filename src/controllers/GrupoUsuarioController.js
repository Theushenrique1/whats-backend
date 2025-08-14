
const GrupoUsuarioService = require('../services/GrupoUsuarioService');

module.exports = {
  async listar(req, res) {
    try {
      const dados = await GrupoUsuarioService.listar();
      res.json(dados);
    } catch (err) {
      console.error('[CONTROLLER] Erro ao listar grupo_usuarios:', err);
      res.status(500).json({ erro: 'Erro ao listar participações' });
    }
  },

  async criar(req, res) {
    try {
      const { grupo_id, usuario_id } = req.body;
      const relacao = await GrupoUsuarioService.criar({ grupo_id, usuario_id });
      res.status(201).json(relacao);
    } catch (err) {
      console.error('[CONTROLLER] Erro ao criar relação grupo-usuário:', err);
      res.status(500).json({ erro: 'Erro ao criar participação' });
    }
  }
};
