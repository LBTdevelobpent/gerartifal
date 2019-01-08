const express = require("express");
const authMiddleware = require("../middlewares/auth.js");
const router = express.Router();

router.use(authMiddleware); //verifica se o token é valido

router.get('/', (req, res) => {
    res.send({ ok: true, user: req.userId });
});

module.exports = app => app.use('/valid', router);