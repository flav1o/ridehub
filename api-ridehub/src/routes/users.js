const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/:id', (req, res, next) => {
    app.services.user.findOne({ id_utilizador: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/money/:id', (req, res, next) => {
    app.services.user.userMoney({ id_utilizador: req.params.id })
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.get('/driver/:id', (req, res, next) => {
    app.services.user.rideDriver(req.params.id)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/active/:id', (req, res, next) => {
    app.services.user.activeRides(req.params.id)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/activeUsers/newcomers', (req, res, next) => {
    app.services.user.activeUsers()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/activeUsers/searchByName', (req, res, next) => {
    app.services.user.searchUserByName(req.query.nome)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.user.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.patch('/:id', (req, res, next) => {
    app.services.user.deactivateAccount(req.params.id)
      .then((result) => res.status(204).json(result))
      .catch((err) => next(err));
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.user.create(req.params.id, req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.delete('/:id', (req, res, next) => {
    app.services.user.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  router.put('/balance/:userID', (req, res, next) => {
    app.services.user.updateUserMoney(req.params.userID, req.body)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};
