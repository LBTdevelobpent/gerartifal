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

router.use('/validSubscribe', admAuthMiddleware);
router.post('/validSubscribe', async (req, res) => {
  try {
    const { id } = req.body;
    const subscribe = await Subcribe.findById(id);
    const openSub = await Opsub.findOne({ unique: true });

    if (!subscribe) {
      res.send(400).send({ error: 'Ficha de inscrição inexistente' });
    }

    const turno = subscribe.turno === 'Matutino' ? openSub.morning : openSub.evening;

    if (subscribe.curso === 'Baixo Acústico') {
      if (turno.Baixo_Acustico === 0) {
        res.send(400).send({ error: 'Turma Já está cheia' });
      } else {
        turno.Baixo_Acustico -= 1;
      }
    }
    if (subscribe.curso === 'Técnica Vocal') {
      if (turno.Tec_Vocal === 0) {
        res.send(400).send({ error: 'Turma Já está cheia' });
      } else {
        turno.Tec_Vocal -= 1;
      }
    }
    if (subscribe.curso === 'Musicalização') {
      if (turno.Musicalizacao === 0) {
        res.send(400).send({ error: 'Turma Já está cheia' });
      } else {
        turno.Musicalizacao -= 1;
      }
    }
    if (subscribe.curso === 'Violino') {
      if (turno.Violino === 0) {
        res.send(400).send({ error: 'Turma Já está cheia' });
      } else {
        turno.Violino -= 1;
      }
    }
    if (subscribe.curso === 'Cello') {
      if (turno.Cello === 0) {
        res.send(400).send({ error: 'Turma Já está cheia' });
      } else {
        turno.Cello -= 1;
      }
    }
    if (subscribe.curso === 'Viola') {
      if (turno.Viola === 0) {
        res.send(400).send({ error: 'Turma Já está cheia' });
      } else {
        turno.Viola -= 1;
      }
    }

    subscribe.valid = true;
    subscribe.save();
    openSub.save();

    res.send({ ok: 'Inscrição validada' });
  } catch (error) {
    res.send(400).send({ error: 'Erro em validar a inscrição' });
  }
});

module.exports = app => app.use('/subcribe', router);
