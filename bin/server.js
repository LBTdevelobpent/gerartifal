//inportar módulos
const app = require('../src/app');
const http = require('http');
const debug = require('debug')('nodestr:server');
const express = require('express');
const path = require('path');

const port = normalizePort(process.env.PORT || '3000');

const server = http.createServer(app);
const router = express.Router();

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
console.log('Acesse em http://localhost:' +port);

//function para encontrar porta disponível
function normalizePort(val){
  const port = parseInt(val, 10);

  if(isNaN(port)){
    return val;
  }
  if(port >= 0){
    return port;
  }
  return false;
}

//function para tratamento de erro
function onError(error){
  if(error.syscall !== 'listen'){
    throw error;
  }

  const bind = typeof port === 'string' ?
    'pipe ' +port :
    'port' +port;

  switch (error.code) {
    case 'EACCES':
      console.error(bind+ ' requires elevanted privileges');
      process.exit(1);
      break;
    case 'EADORINUSE':
      console.error(bind+ ' is already in use');
      process.exit(1)
      break;
    default:
      throw error;
  }
}

function onListening(){
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? 'pipe ' +addr
    : 'port ' +addr.port;
  debug('listening on ' +bind);
}
