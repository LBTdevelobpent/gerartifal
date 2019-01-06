const express = require('express');
const router = express.Router();
const path = require('path');

//rota principal
// então, criamos uma rota para '/'
router.get('/', (req, res) => {
  // aqui precisamos enviar o index.html para o cliente
  res.sendFile(path.join(__dirname + '../../../index.html'));
});

module.exports = router;
