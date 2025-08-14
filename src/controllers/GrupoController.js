
const GrupoService = require('../services/GrupoService');


 // metodo para listar os grupos vindo do get
module.exports = {
  async listar(req, res) {
    try {
      const grupos = await GrupoService.listar();
      res.json(grupos);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao listar grupos' });
    }
  },
// metodo para criar o grupo chamado no post
  async criar(req, res) {
    try {
      const { nome } = req.body;
      const grupo = await GrupoService.criar({ nome });
      res.status(201).json(grupo);
    } catch (err) {
      console.error(err);
      res.status(500).json({ erro: 'Erro ao criar grupo' });
    }
  }
};
