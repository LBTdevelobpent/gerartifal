const express = require('express');
const authMiddleware = require('../middlewares/auth.js');

const User = require('../models/user.js');
const { key } = require('../../config/admKey.json');

const router = express.Router();

router.use(authMiddleware); // verifica se o token é valido


// ================================Valida uma sessão===========================//
router.get('/', (req, res) => {
  res.send({ ok: true, user: req.userId, open: req.open });
});
// ============================================================================//


// ============================Valida uma sessão de ADM=======================//
router.post('/adm', async (req, res) => {
  const { adm, email, _id } = req.body;

  if (!adm) {
    return res.status(401).send({ error: 'Token Administrador Não Existe' });
  }

  if (adm.split(' ')[0] !== key) {
    return res.status(401).send({ error: 'Token Administrador Malformatado' });
  }

  if (!(_id === req.userId)) {
    return res.status(401).send({ error: 'Administrador Não Encontrado' });
  }
  const user = await User.findOne({ email, adm });

  if (!user) {
    return res.status(401).send({ error: 'Apenas Administrador' });
  }

  return res.send({ ok: true, user });
});
// ===========================================================================//

module.exports = app => app.use('/valid', router);
