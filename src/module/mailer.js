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
    extName: '.ejs',
    partialsDir: './src/resources/mail/',
    layoutsDir: './src/resources/mail/',
    defaultLayout: 'mail.ejs',
  },
  viewPath: path.resolve('./src/resources/mail/'),
  extName: '.ejs',
}));

module.exports = transport;
