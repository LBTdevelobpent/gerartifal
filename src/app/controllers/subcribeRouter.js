const express = require('express');

const router = express.Router();
const authMiddleware = require('../middlewares/auth.js');
const Subcribe = require('../models/subcribe.js');
const User = require('../models/user.js');

router.use(authMiddleware);

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

router.get('/find', async (req, res) => {
  try {
    const subcribe = await Subcribe.findOne({ user: req.userId }).populate('user');

    return res.send({ subcribe });
  } catch (err) {
    return res.status(400).send({ error: 'Error em encontrar inscrição' });
  }
});

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

module.exports = app => app.use('/subcribe', router);
