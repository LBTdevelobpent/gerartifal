const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const mailer = require('../../module/mailer.js');
const authConfig = require('../../config/auth.json');
const User = require('../models/user.js'); // Call do model mongo, por ele que se faz as buscas no mongo


// -----------------Gera Um token de Autenticação----------------//
function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, { // KELLYMEUAMOR
    expiresIn: 3600,
  });
}
// ------------------------------------------------------------//

const router = express.Router(); // Chamada de uma rota


// -------------------------Registro no DB--------------------//
router.post('/register', async (req, res) => {
  const { name, email } = req.body;

  try {
    // Check para ver se já tem usuario cadastrado
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'Email já existe' });
    }

    if (await User.findOne({ name })) {
      return res.status(400).send({ error: 'Nome de Usario já existe' });
    }

    const user = await User.create(req.body); // Criar O Doc no MongoDB

    // ----------------Parte de envio de email----------------//
    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    mailer.sendMail({

      to: email,
      from: 'nigga@reallyNigga.com',
      template: 'verifyEmail',
      context: { token, email }, // Coloca no email uma varivel

    }, (err) => {
      if (err) {
        return res.status(400).send({ error: 'Error no envio de email' });
      }
      return 0;
    });
    // ------------------------------------------------------//


    user.password = undefined; // Não retornar a senha para o usuario
    return res.send({ ok: true });
  } catch (err) {
    return res.status(400).send({ error: 'Não foi possivel cadastrar' });
  }
});
// ----------------------------------------------------------//


router.post('/register_verify', async (req, res) => {
  const { email, token } = req.body;

  try {
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires verified');

    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: 'Token Invalido' });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      await User.findOneAndRemove({ email });
      return res.status(400).send({ error: 'O tempo de vericação expirou, tente se cadastrar novamente' });
    }

    await User.findOneAndUpdate({ email: email }, {
      $set: {
        verified: true,
      },
    });


    return res.send({ ok: true });
  } catch (err) {
    return res.status(400).send({ error: 'Erro no verificar o email' });
  }
});

// -------------------------------Login--------------------------------------//
router.post('/authenticate', async (req, res) => {
  const { name, password } = req.body;

  const user = await User.findOne({ name }).select('+password');

  if (!user) { // Check se usuario existe
    return res.status(400).send({ error: 'Usuario inexistente' });
  }
  if (user.verified === false) {
    return res.status(400).send({ error: 'Email não verificado' });
  }
  // Está comparando as senhas, a que o usuario fez login e a do BD
  if (!await bcrypt.compare(password, user.password)) {
    return res.status(400).send({ error: 'Senhas não batem' });
  }

  user.password = undefined;
  return res.send({ user, token: generateToken({ id: user.id }) });
});
// -------------------------------------------------------------------------//

// --------------------------Esquecimento de senha------------------------//
router.post('/forgot_password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }

    const token = crypto.randomBytes(20).toString('hex');

    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });

    mailer.sendMail({

      to: email,
      from: 'nigga@reallyNigga.com',
      template: 'mail',
      context: { token, email }, // Coloca no email uma varivel

    }, (err) => {
      if (err) {
        return res.status(400).send({ error: 'Error no envio de email' });
      }

      return res.send({ ok: true });
    });
  } catch (err) {
    return res.status(400).send({ error: 'Erro no esqueci minha senha' });
  }
  return 0;
});

router.post('/reset_password', async (req, res) => {
  const { email, token, password } = req.body;

  try {
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }

    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: 'Token Invalido' });
    }

    const now = new Date();

    if (now > user.passwordResetExpires) {
      return res.status(400).send({ error: 'Token Expirou' });
    }

    user.password = password;

    await user.save();

    return res.send({ ok: true });
  } catch (err) {
    return res.status(400).send({ error: 'Erro no esqueci recuperar senha' });
  }
});
// -----------------------------------------------------------------------//

router.get('/getAll', async (req, res) => {
  const user = await User.find();
  if (!user) {
    return res.status(400).send({ error: 'Não existe nenhum usuario' });
  }
  return res.send({ user });
});


module.exports = app => app.use('/auth', router);
