const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authConfig = require('../../config/auth.json');
const User = require('../models/user.js');
const authMiddleware = require('../middlewares/auth.js');


// -----------------Gera Um token de Autenticação----------------//
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 86400,
  });
}
// ------------------------------------------------------------//


const router = express.Router();

router.use(authMiddleware);

// =========================Modifica informações do Usuario================//
router.put('/modify', async (req, res) => {
  try {
    const userModify = req.body;
    const { userId } = req.userId;
    const user = await User.findOne({ _id: userId }).select('+password');

    const exist = await User.findOne({ name: userModify.name });

    if (exist) {
      return res.status(400).send({ error: 'Nome de Usuario já está sendo usado' });
    }

    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }

    if (!await bcrypt.compare(userModify.password, user.password)) {
      return res.status(400).send({ error: 'Senhas não batem' });
    }

    user.name = userModify.name;
    user.password = userModify.Npassword;

    await user.save();

    user.password = undefined;

    return res.send({ user, ok: true, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: 'Não foi possivel atualizar' });
  }
});

module.exports = app => app.use('/options', router);
