
const express = require('express');
const router = express.Router();
const GrupoController = require('../controllers/GrupoController');

//rota de buscar os grupos
router.get('/', GrupoController.listar);
// rota de criar os grupos
router.post('/', GrupoController.criar);

module.exports = router;
