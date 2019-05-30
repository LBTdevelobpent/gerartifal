const express = require('express');

const app = express();
const fs = require('file-system');
const ejs = require('ejs');
const path = require('path');

const router = express.Router();

app.set('view engine', 'ejs');

function extension(element) {
  const extName = path.extname(element);
  return extName === '.json';
}

router.get('/getCarrousel', (req, res) => {
  try {
    const d = new Date();
    const date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;

    // função para checkar as noticias mais recentes
    // eslint-disable-next-line no-inner-declarations
    function recent(data, da) {
      fs.readdir(path.resolve(`src/news/${data}`), (err, list) => {
        let i = 1;
        const items = [];

        // ----------------------------Codigo para evitar loop infinito---------------//
        if (da.getFullYear() < 2019) {
          return res.status(404).send({ error: 'No have news before this year' });
        }
        // --------------------------------------------------------------------------//
        if (err || items === undefined) {
          const ontem = new Date(da.getTime());
          ontem.setDate(da.getDate() - i);
          i += 1;
          recent(`${ontem.getMonth()}-${ontem.getDate()}-${ontem.getFullYear()}`, ontem);
        } else {
          list.filter(extension).forEach((value) => {
            items.push(value);
          });
          const post = []; // Array que adiciona todos as informações dos posts
          for (let c = 0; c < items.length; c += 1) {
            // eslint-disable-next-line no-loop-func
            fs.readFile(path.resolve(`src/news/${data}/${items[c]}`), (error, dados) => {
              const dat = JSON.parse(dados);
              dat.c = c;
              post.push(dat);
              if (c === (items.length - 1)) {
                res.send(post[0]); // renderizar os post no INDEX
              }
              if (error) {
                return res.status(500).send({ error: 'FileSystem Error' });
              }
            });
          }
        }
      });
    }

    recent(date, d);
  } catch (err) {
    return res.status(404).send({ error: 'Noticias não encontradas' });
  }
});

// ==========================Pega as noticas mais recentes e põe na tela==========================//
router.get('/getPosts', (req, res) => {
  try {
    const d = new Date();
    const date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;

    // função para checkar as noticias mais recentes
    // eslint-disable-next-line no-inner-declarations
    function recent(data, da) {
      fs.readdir(path.resolve(`src/news/${data}`), (err, list) => {
        let i = 1;
        const items = [];

        // ----------------------------Codigo para evitar loop infinito---------------//
        if (da.getFullYear() < 2019) {
          return res.status(404).send({ error: 'No have news before this year' });
        }
        // --------------------------------------------------------------------------//
        
        if (err || items === undefined) {
          const ontem = new Date(da.getTime());
          ontem.setDate(da.getDate() - i);
          i += 1;
          recent(`${ontem.getMonth()}-${ontem.getDate()}-${ontem.getFullYear()}`, ontem);
        } else {
          list.filter(extension).forEach((value) => {
            items.push(value);
          });
          const post = []; // Array que adiciona todos as informações dos posts
          for (let c = 0; c < items.length; c += 1) {
            // eslint-disable-next-line no-loop-func
            fs.readFile(path.resolve(`src/news/${data}/${items[c]}`), (error, dados) => {
              const dat = JSON.parse(dados);
              dat.c = c;
              post.push(dat);
              if (c === (items.length - 1)) {
                res.render('index', { post }); // renderizar os post no INDEX
              }
              if (error) {
                return res.status(500).send({ error: 'FileSystem Error' });
              }
            });
          }
        }
      });
    }

    recent(date, d);
  } catch (err) {
    return res.status(404).send({ error: 'Noticias não encontradas' });
  }
});
// ====================================================================================//

// ===========================Pega noticias de um dia expecifico=======================//
router.get('/getPosts/:date', (req, res) => {
  try {
    const { date } = req.params;

    fs.readdir(path.resolve(`news/${date}`), (err, items) => {
      let html = '';
      for (let c = 0; c < items.length; c += 1) {
        // eslint-disable-next-line no-loop-func
        fs.readFile(path.resolve(`src/news/${date}/${items[c]}`), (err, dados) => {
          html += dados.toString();
          if (c === (items.length - 1)) {
            res.render('index', { body: html });
          }
        });
      }
    });
  } catch (err) {
    return res.status(404).send({ error: 'Noticias não encontradas de data especifica' });
  }
});
// =================================================================================//

// ================================Pega uma noticia especifica======================//
router.get('/getPost/:date/:postName', (req, res) => {
  try {
    const { date, postName } = req.params;
    res.sendFile(path.resolve(`src/news/${date}/${postName}.html`), {
      headers: {
        'x-timestamp': Date.now(),
        'x-sent': true,
      },
    }, (err) => {
      if (err) {
        throw err;
      }
    });
  } catch (err) {
    return res.status(404).send({ error: 'Noticias especifica não encontrada' });
  }
});
// =================================================================================//

// =============================Adiciona um post=========================================//
router.post('/addPost', (req, res) => {
  try {
    const { title, body, image } = req.body;
    const d = new Date();
    const date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;

    // Vai conferir se já existe uma pasta da data atual
    fs.stat(path.resolve(`src/news/${date}`), (erro) => {
      if (erro) {
        // Caso não existe, irar criar uma
        fs.mkdirSync(path.resolve(`src/news/${date}`));
        // Nomeando o arquivo
        let archiName = title.toLowerCase();
        while (archiName.indexOf(' ') !== -1) { archiName = archiName.replace(' ', '-'); }

        // ---------------------Escrevendo um arquivo dentro da pasta------------------//
        ejs.renderFile(path.resolve('src/resources/templates/template.ejs'), { date, archiName, title, body, image }, (err, html) => {
          if (err) {
            console.log(err);
          }
          fs.writeFile(path.resolve(`src/news/${date}/${archiName}.html`), html, (error) => {
            if (error) {
              console.log(error);
            }
          });
          fs.writeFile(path.resolve(`src/news/${date}/${archiName}.json`), `{ "date": "${date}", "archiName": "${archiName}", "title": "${title}", "body": "${body}", "image": "${image}" }`, (error) => {
            if (error) {
              console.log(error);
            }
          });
        });
        // ----------------------------------------------------------------------------//
      } else {
        // ---------------Caso exista só vai criar um novo arquivo dentro-------------//
        let archiName = title.toLowerCase();
        while (archiName.indexOf(' ') !== -1) {
          archiName = archiName.replace(' ', '-');
        }

        ejs.renderFile('src/resources/templates/template.ejs', { date, archiName, title, body, image }, (err, html) => {
          if (err) {
            console.log(err);
          }
          fs.writeFile(path.resolve(`src/news/${date}/${archiName}.html`), html, (error) => {
            if (error) {
              console.log(error);
            }
          });
          fs.writeFile(path.resolve(`src/news/${date}/${archiName}.json`), `{ "date": "${date}", "archiName": "${archiName}", "title": "${title}", "body": "${body}", "image": "${image}" }`, (error) => {
            if (error) {
              console.log(error);
            }
          });
        });
        // --------------------------------------------------------------------------//
      }
    });
    res.redirect('/app/views/blog.html');
  } catch (err) {
    return res.status(400).send({ error: 'Erro em criar uma nova noticia' });
  }
});
// =======================================================================================//

// ===============================Usado para remover o post=============================//
router.delete('/removePost/:date/:postName', (req) => {
  try {
    const { date, postName } = req.params;
    fs.unlink(path.resolve(`src/news/${date}/${postName}.html`), (err) => {
      if (err) {
        console.log(err);
      }
    });
  } catch (err) {
    return res.status(400).send({ error: 'Erro em apagar uma noticia' });
  }
});
// ====================================================================================//

// Pega o caminho aonde está o post, para mostrar as datas onde tem post criado
router.get('/getPostPath', (req, res) => {
  fs.readdir(path.resolve('src/news'), (err, items) =>{
    if (err) {
      return res.send({ error: 'Error Post Path' });
    }
    return res.send({ path: items.reverse() });
  });
});
// ----------------------------------------------------------------------------

module.exports = app => app.use('/blog', router);
