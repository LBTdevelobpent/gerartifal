const express = require('express');
const authMiddleware = require('../middlewares/auth.js');


const User = require('../models/user.js');

const router = express.Router();

router.use(authMiddleware);

module.exports = async (req, res, next) => {
  const user = await User.findById(req.userId);

  if (!user.adm) {
    return res.status(401).send({ error: 'Apenas Administrador' });
  }

  return next();
};
