
const UsuarioService = require('../services/UsuarioService');

module.exports = {
  async listar(req, res) {
    try {
      const usuarios = await UsuarioService.listar();
      res.json(usuarios);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
  },

  async criar(req, res) {
    try {
      const { nome, numero } = req.body;
      const usuario = await UsuarioService.criar({ nome, numero });
      res.status(201).json(usuario);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao criar usuário' });
    }
  }
};
