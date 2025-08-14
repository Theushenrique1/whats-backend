
const express = require('express');
const router = express.Router();
const GrupoUsuarioController = require('../controllers/GrupoUsuarioController');

router.get('/', GrupoUsuarioController.listar);
router.post('/', GrupoUsuarioController.criar);

module.exports = router;
