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

router.put('/modify', async (req, res) => {
  const userM = req.body;
  const { userId } = req.userId;
  const user = await User.findOne({ _id: userId }).select('+password');
  try {
    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }

    if (!await bcrypt.compare(userM.password, user.password)) {
      return res.status(400).send({ error: 'Senhas não batem' });
    }

    user.name = userM.name;
    user.password = userM.password;

    await user.save();

    user.password = undefined;

    return res.send({ user, ok: true, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: 'Não foi possivel atualizar' });
  }
});

/*
router.post('/user_image', async (req, res) => {
  const { image } = req.body;

  fs.readFile(image.path, (err, data) => {
    UserImg.create({
      img: data,
    }, (error, user) => {
      if (error) {
        return res.status(400).send({ error: 'error em inserir uma image' });
      }
      if (user) {
        return res.send({ ok: true });
      }
      return 0;
    });
  });
  return res.send({ error: 'algo aconteceu' });
});
*/
module.exports = app => app.use('/options', router);
