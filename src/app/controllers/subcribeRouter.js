const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.js');
const Subcribe = require('../models/subcribe.js');
const User = require('../models/user.js');

router.use(authMiddleware);

// ==========================Criação de uma ficha de inscrição no banco====================//
router.post('/create', async (req, res) => {
  try {
    const { cpf } = req.body;

    if (await Subcribe.findOne({ cpf })) {
      return res.status(400).send({ error: 'Inscrição já feita' });
    }

    const subcribe = await Subcribe.create({ ...req.body, user: req.userId });

    return res.send({ subcribe });
  } catch (err) {
    return res.status(400).send({ error: 'Error em criar uma inscrição' });
  }
});
// =======================================================================================//

// =============================Busca a ficha do proprio usuario==========================//
router.get('/find', async (req, res) => {
  try {
    const subcribe = await Subcribe.findOne({ user: req.userId }).populate('user');

    return res.send({ subcribe });
  } catch (err) {
    return res.status(400).send({ error: 'Error em encontrar inscrição' });
  }
});
// ========================================================================================//

// ====================================Apaga a ficha do banco==============================//
router.delete('/:subId', async (req, res) => {
  try {
    if (!await Subcribe.findOne({ user: req.params.subId })) {
      return res.status(400).send({ error: 'Inscrição já apagada' });
    }

    await Subcribe.findOneAndRemove({ user: req.params.subId });

    return res.send({ ok: true });
  } catch (err) {
    return res.status(400).send({ error: 'Error em apagar inscrição' });
  }
});
// ========================================================================================//

// ================================================ADM======================================//

// ======================================Busca todas as fichas==============================//

router.get('/findAll', async (req, res) => {
  try {
    const { adm } = await User.findById(req.userId);
    if (adm) {
      return res.status(401).send({ error: 'Apenas ADM' });
    }

    if (adm === false) {
      return res.status(401).send({ error: 'Apenas ADM' });
    }

    const subcribe = await Subcribe.find().populate('user');

    return res.send({ subcribe });
  } catch (err) {
    return res.status(400).send({ error: 'Error em encontrar inscrição' });
  }
});
// ======================================================================================//

// =====================================Busca uma ficha específica=======================//
router.put('/find_subscription', async (req, res) => {
  try {
    const { adm } = await User.findById(req.userId);

    if (adm) {
      return res.status(401).send({ error: 'Apenas ADM' });
    }

    if (adm === false) {
      return res.status(401).send({ error: 'Apenas ADM' });
    }

    const { nome, CPF } = req.body;

    // Script para buscar a ficha letra por letra, caso não tenha CPF sendo passado
    if (CPF === 0) {
      const subcribe = await Subcribe.find().populate('user');

      for (let c = 0; c < subcribe.length; c += 1) {
        const { name } = subcribe[c];
        if (!(nome.split('').join('') === name.split('', nome.length).join(''))) {
          subcribe.splice(subcribe.indexOf(subcribe[c]), 1);
          c -= 1;
        }
      }
      return res.send({ subcribe });
    }
    // ----------------------------------------------------------------------------//

    const subcribe = await Subcribe.find({ $or: [{ name: nome }, { cpf: CPF }] }).populate('user');
    return res.send({ subcribe });
  } catch (err) {
    return res.status(400).send({ error: 'Error em encontrar inscrição' });
  }
});
// ======================================================================================//

module.exports = app => app.use('/subcribe', router);
