const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/:page', (req, res, next) => {
    app.services.listed.findAll(req.params.page)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/search/:page', (req, res, next) => {
    app.services.listed.searchOrder(req.query)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/search/word/:type', (req, res, next) => {
    app.services.listed.searchWord(req.query)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  return router;
};
