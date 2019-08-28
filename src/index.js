const express = require('express');

const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');

const port = normalizePort(process.env.PORT || '3000');

const server = app.listen(port);
const io = require('socket.io').listen(server);

const User = require('./app/models/user.js');
const Opsub = require('./app/models/openSub.js');

const subscribeMiddleware = require('./app/middlewares/subscribeMiddleware.js');
const admAuthMiddleware = require('./app/middlewares/admAuth');

// =================== Configurações servidor ==============//
require('./config/passport.js')(passport);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/index.html'));
});

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '/www')));
app.set('views', `${__dirname}/views`);

app.use(passport.initialize());
app.use(passport.session());
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: '084cfe37060434b2a49492a784a43364',
}));

// ========================================================//

// -------------------------Para abrir inscrições------------------//
app.use('/openSubs', admAuthMiddleware);
app.post('/openSubs', async (req, res) => {
  try {
    const {
      from,
      until,
      morning,
      evening,
    } = req.body;
    const opensub = await Opsub.findOne({ unique: true });
    opensub.from = from;
    opensub.until = until;
    opensub.morning = morning;
    opensub.evening = evening;

    opensub.save();
    res.send(opensub);
  } catch (error) {
    res.status(400).send({ error });
  }
});

io.sockets.on('connection', async (socket) => {
  socket.emit('openF', await Opsub.findOne({ unique: true }));
});

// -------------------------------------------------------------//

require('./app/controllers/index.js')(app);

// --------------------------Apagar diariamente contas não verificadas------------------
function sleep(h) {
  return new Promise(resolve => setTimeout(resolve, h * 3600000));
}

async function demo() {
  await sleep(24);

  const users = await User.find({ verified: false })
    .select('+passwordResetExpires verified');
  const now = new Date();
  if (!users) {
    demo();
  }
  for (let c = 0; c < users.length; c += 1) {
    if (now > users[c].passwordResetExpires) {
      await User.findByIdAndRemove(users[c]._id);
    }
  }
  demo();
}

demo();
// ----------------------------------------------------------------------------------

// function para encontrar porta disponível
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

// =============================== SPA ROUTES CONFIG =================================//

/**
 * Esse Bloco de codigo serve para caso o usuario der refresh não der erro 404
 * Infelizmente tem q ser feito dessa forma, se não buga
 */

app.use('/form', subscribeMiddleware);

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/app/views/login.html'));
});

app.get('/:anyone', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/index.html'));
});

app.get('/:date/:post', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/index.html'));
});

// ==================================================================================//
