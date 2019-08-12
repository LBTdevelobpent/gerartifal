const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const passport = require('passport');
const querystring = require('querystring');

const mailer = require('../../module/mailer.js');
const { secret } = require('../../config/auth.json');// KELLYMEUAMOR é o secret ( Eu gosto de esterEggs, são divertidos)
const User = require('../models/user.js'); // Chamada do model mongo, por ele que se faz as buscas no mongo
const captchaMiddleware = require('../middlewares/recaptcha.js');

// =========================Gera Um token de Autenticação=====================//
function generateToken(params = {}) {
  return jwt.sign(params, secret, {
    expiresIn: 3600,
  });
}
// ==========================================================================//

const router = express.Router(); // Chamada de uma rota

// ========================== Verificação do Email ===========================//
router.post('/register_verify', async (req, res) => {
  try {
    const { email, token } = req.body;
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires verified');

    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }
    // Verifica a Validade do Token
    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: 'Token Invalido' });
    }
    // ----------------------Verifica se o Token expirou--------------------//
    const now = new Date();
    if (now > user.passwordResetExpires) {
      await User.findOneAndRemove({ email });
      return res.status(400).send({ error: 'O tempo de vericação expirou, tente se cadastrar novamente' });
    }
    // --------------------------------------------------------------------//

    // Modifica o Verificado para True, assim verificando de fato o email
    await User.findOneAndUpdate({ email }, {
      $set: {
        verified: true,
      },
    });


    return res.send({ ok: true });
  } catch (err) {
    return res.status(400).send({ error: 'Erro no verificar o email' });
  }
});
// ===========================================================================//

// ===================================Login===================================//
router.post('/authenticate', async (req, res) => {
  try {
    const { emailOrUser, password } = req.body;

    const user = await User.findOne({ $or: [{ email: emailOrUser }, { name: emailOrUser }] }).select('+password');

    // Check se usuario existe
    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }
    if (user.verified === false) {
      return res.status(400).send({ error: 'Email não verificado' });
    }
    // Compara a Senha do enviada com a do Banco
    if (!await bcrypt.compare(password, user.password)) {
      return res.status(400).send({ error: 'Senhas não batem' });
    }

    user.password = undefined;
    return res.send({ user, token: generateToken({ id: user.id }) });
  } catch (err) {
    return res.status(400).send({ error: 'Erro na autenticação do login' });
  }
});
// =========================================================================//

// =============================Esquecimento de senha=======================//
router.post('/forgot_password', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }

    const token = crypto.randomBytes(20).toString('hex'); // Cria um Token para o MAIL

    // Determina a validade do MAIL
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
      from: 'lbtdevelopmentinc@gmail.com',
      subject: 'Esquecimento de Senha no Sistema Gerartifal',
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
});
// =====================================================================//

// =============================Reset de Senha===========================//
router.post('/reset_password', async (req, res) => {
  try {
    const { email, token, password } = req.body;
    const user = await User.findOne({ email }).select('+passwordResetToken passwordResetExpires');

    if (!user) {
      return res.status(400).send({ error: 'Usuario inexistente' });
    }
    // Verifica a Validade do Token
    if (token !== user.passwordResetToken) {
      return res.status(400).send({ error: 'Token Invalido' });
    }

    // ---------------------Verifica se o Token expirou----------------//
    const now = new Date();
    if (now > user.passwordResetExpires) {
      return res.status(400).send({ error: 'Token Expirou' });
    }
    // ----------------------------------------------------------------//
    user.password = password;

    await user.save();

    return res.send({ ok: true });
  } catch (err) {
    return res.status(400).send({ error: 'Erro no esqueci recuperar senha' });
  }
});
// ==========================================================================//

// ============================== Login Social ==============================//

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
  const { user } = req;

  if (user.adm) {
    const query = querystring.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      adm: user.adm,
      token: generateToken({ id: user.id }),
    });
    res.redirect(`/?${query}`);
  } else {
    const query = querystring.stringify({
      id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken({ id: user.id }),
    });
    res.redirect(`/?${query}`);
  }
});
// ==========================================================================//

// ===============================Registro no DB=============================//
router.use('/register', captchaMiddleware);
router.post('/register', async (req, res) => {
  try {
    const { name, email } = req.body;
    // --------------Check para ver se já tem usuario cadastrado--------//
    if (await User.findOne({ email })) {
      return res.status(400).send({ error: 'Email já existe' });
    }

    if (await User.findOne({ name })) {
      return res.status(400).send({ error: 'Nome de Usario já existe' });
    }
    // ---------------------------------------------------------------//

    const user = await User.create(req.body); // Criar O Doc no MongoDB

    // ----------------Parte de envio de email----------------//

    const token = crypto.randomBytes(20).toString('hex'); // Cria um Token para o MAIL

    // --------------Determina a validade do MAIL------------//
    const now = new Date();
    now.setHours(now.getHours() + 1);

    await User.findByIdAndUpdate(user.id, {
      $set: {
        passwordResetToken: token,
        passwordResetExpires: now,
      },
    });
    // -----------------------------------------------------//
    mailer.sendMail({

      to: email,
      from: 'lbtdevelopmentinc@gmail.com',
      subject: 'Verificação de Email no Sistema Gerartifal',
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
// ============================================================================//


module.exports = app => app.use('/auth', router);
