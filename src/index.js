const express = require('express');

const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const User = require('./app/models/user.js');


// --------------------Rederização da pagina-------//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/www/index.html'));
});
app.use(express.static(path.join(__dirname, '/www')));
// -----------------------------------------------//

require('./app/controllers/index.js')(app);

const port = normalizePort(process.env.PORT || '3000');
app.listen(port);


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
  for (let c = 0; c < users.length; c++) {
    if (now > users[c].passwordResetExpires) {
      await User.findByIdAndDelete(users[c]._id);
    }
  }
  demo();
}

demo();
// ----------------------------------------------------------------------------------

// function para encontrar porta disponível
function normalizePort (val) {
  const port = parseInt(val, 10);

  if(isNaN(port)){
    return val;
  }
  if(port >= 0){
    return port;
  }
  return false;
}

