const request = require('request');
const { secretKey } = require('../../config/recaptcha.json');

module.exports = (req, res, next) => {
  const { captcha } = req.body;

  if (captcha === undefined || captcha === '' || captcha === null) {
    return res.status(401).send({ error: 'Por favor, selecione o Captcha' });
  }

  // Verificação do Captcha
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&reponse=${captcha}&remoteip=${req.connection.remoteAddress}`

  request(verifyUrl, (err, response, body) => {
    body = JSON.parse(body);

    if (body.sucess !== undefined && !body.sucess) {
      return res.status(401).send({ error: 'Error na Verificação do Captcha' });
    }

    return next();
  });
};
