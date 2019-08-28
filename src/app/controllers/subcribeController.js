const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.js');
const admAuthMiddleware = require('../middlewares/admAuth');
const Subcribe = require('../models/subcribe.js');
const Opsub = require('../models/openSub.js');

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
router.use('/findAll', admAuthMiddleware);
router.get('/findAll', async (req, res) => {
  try {
    const subscribe = await Subcribe.find().populate('user');

    return res.send({ subscribe });
  } catch (err) {
    return res.status(400).send({ error: 'Error em encontrar inscrição' });
  }
});
// ======================================================================================//
/*
router.use('/validSubscribe', admAuthMiddleware);
router.get('/validSubscribe', async (req, res) => {
  try {
    const { id } = req.body;
    const subscribe = await Subcribe.findById(id);
    const openSub = await Opsub.findOne({ unique: true });

    const turno = subscribe.turno === 'Matutino' ? morning : evening;


    if (!subscribe) {
      res.send(400).send({ error: 'Ficha de inscrição inexistente' });
    }

    subscribe.valid = true;
    subscribe.save();

    res.send({ ok: 'Inscrição validada' });
  } catch (error) {
    res.send(400).send({ error: 'Erro em validar a inscrição' });
  }
});
*/
module.exports = app => app.use('/subcribe', router);
