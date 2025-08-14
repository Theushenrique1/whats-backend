
const express = require('express');
const router = express.Router();
const MensagemController = require('../controllers/MensagemController');

router.get('/', MensagemController.listar);
router.post('/', MensagemController.criar);

module.exports = router;
