const express = require('express');

const path = require('path');

const News = require('../models/news.js');

const router = express.Router();

router.get('/getCarrousel', async (req, res) => {
  try {
    const news = await News.find({});

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
    do {
      recents.push(news[count]);
      count += 1;
    } while (count < recents.length && count < 4);

    return res.render('index', { post: recents });
  } catch (err) {
    return res.status(404).send({ error: 'Noticias não encontradas' });
  }
});
// ====================================================================================//

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
    const news = await News.find({ date, archiName });

    return res.render(path.resolve('src/resources/templates/template.ejs'), news[0]);
  } catch (err) {
    return res.status(404).send({ error: 'Noticias especifica não encontrada' });
  }
});
// =================================================================================//

// =============================Adiciona um post=========================================//
router.post('/addPost', async (req, res) => {
  try {
    const { title, body, image } = req.body;
    const d = new Date();
    const date = `${d.getMonth()}-${d.getDate()}-${d.getFullYear()}`;

    let archiName = title.toLowerCase();
    while (archiName.indexOf(' ') !== -1) { archiName = archiName.replace(' ', '-'); }

    await News.create({
      date,
      archiName,
      title,
      body,
      image,
    });

    return res.redirect('/app/views/blog.html');
  } catch (err) {
    return res.status(400).send({ error: 'Erro em criar uma nova noticia' });
  }
});
// =======================================================================================//

// ===============================Usado para remover o post=============================//
router.delete('/removePost/:date/:archiName', async (req, res) => {
  try {
    const { date, archiName } = req.params;
    await News.findOneAndDelete({ date, archiName });
    return res.redirect('/app/views/blog.html');
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
