const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const {
  service,
  host,
  port,
  secure,
  user,
  pass,
} = require('../config/mail.json');

const transport = nodemailer.createTransport({
  service,
  host,
  port,
  secure,
  auth: { user, pass },
});

transport.use('compile', hbs({
  viewEngine: {
    extName: '.html',
    partialsDir: './resources/mail/',
    layoutsDir: './resources/mail/',
    defaultLayout: 'verifyEmail.html',
  },
  viewPath: path.resolve('./resources/mail/'),
  extName: '.html',
}));

module.exports = transport;
