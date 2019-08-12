const express = require('express');

const path = require('path');
const formidable = require('formidable');
const compress = require('../middlewares/compress.js');

const News = require('../models/news.js');
const authMiddleware = require('../middlewares/auth.js');

const router = express.Router();

router.get('/getCarrousel', async (req, res) => {
  try {
    const news = await News.find({});
    news.reverse();
    return res.send(news[0]);
  } catch (err) {
    return res.status(404).send({ error: 'Noticias não encontradas' });
  }
});

// ==========================Pega as noticas mais recentes e põe na tela==========================//
router.get('/getPosts', async (req, res) => {
  try {
    const news = await News.find({});
    const recents = [];
    let count = 0;
    news.reverse();
    do {
      recents.push(news[count]);
      count += 1;
    } while (count < news.length && count < 4);
    return res.render('index', { post: recents });
  } catch (err) {
    return res.status(404).send({ error: 'Noticias não encontradas' });
  }
});
// ====================================================================================//
router.get('/getPostsAdm', async (req, res) => {
  try {
    const news = await News.find({});
    const recents = [];
    let count = 0;
    news.reverse();
    do {
      recents.push(news[count]);
      count += 1;
    } while (count < news.length);
    return res.render('postsAdm', { post: recents });
  } catch (err) {
    return res.status(404).send({ error: 'Noticias não encontradas' });
  }
});
// ===========================Pega noticias de um dia expecifico=======================//
router.get('/getPosts/:date', async (req, res) => {
  try {
    const { date } = req.params;
    const news = await News.find({ date });

    return res.render('index', { post: news });
  } catch (err) {
    return res.status(404).send({ error: 'Noticias não encontradas de data especifica' });
  }
});
// =================================================================================//

// ================================Pega uma noticia especifica======================//
router.get('/getPost/:date/:archiName', async (req, res) => {
  try {
    const { date, archiName } = req.params;
    const news = await News.findOne({ date, archiName });

    return res.render(path.resolve('src/resources/templates/template.ejs'), news);
  } catch (err) {
    return res.status(404).send({ error: 'Noticias especifica não encontrada' });
  }
});
// =================================================================================//

// =============================Adiciona um post=========================================//
router.post('/addPost', (req, res) => {
  try {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (!fields || !files) {
        return res.status(400).send({ error: 'Há campos vazios' });
      }

      const { title, body } = fields;
      const { image } = files;
      compress.compressImage(image, 1200, 720)
        .then(async (data) => {
          const d = new Date();
          const date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;

          let archiName = title.toLowerCase();
          while (archiName.indexOf(' ') !== -1) { archiName = archiName.replace(' ', '-'); }

          await News.create({
            date,
            archiName,
            title,
            body,
            image: data,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });

    res.redirect('/posts');
  } catch (err) {
    return res.status(400).send({ error: 'Erro em criar uma nova noticia' });
  }
});
// =======================================================================================//

// ===============================Usado para remover o post=============================//
router.use('/removePost/:date/:archiName', authMiddleware);
router.delete('/removePost/:date/:archiName', async (req, res) => {
  try {
    const { date, archiName } = req.params;
    await News.findOneAndDelete({ date, archiName }, (err) => {
      if (err) {
        return res.status(400).send({ error: 'Error em apagar post' });
      }
    });
    res.status(200).send({ sucess: 'Sucesso' });
  } catch (err) {
    return res.status(400).send({ error: 'Erro em apagar uma noticia' });
  }
});
// ====================================================================================//

// Pega o caminho aonde está o post, para mostrar as datas onde tem post criado
router.get('/getPostPath', async (req, res) => {
  try {
    await News.find({}, (err, docs) => {
      if (err) {
        return res.status(404).send({ error: 'Caminhos não encontrados' });
      }
      const paths = [];
      for (let c = 0; c < docs.length; c += 1) {
        paths.push(docs[c].date);
      }
      return res.send(paths);
    });
    return 0;
  } catch (err) {
    return res.status(404).send({ error: 'Caminhos não encontrados' });
  }
});
// ----------------------------------------------------------------------------

module.exports = app => app.use('/blog', router);
