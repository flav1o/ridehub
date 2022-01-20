const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.occupant.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.occupant.findOne({ id_ocupante: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/ride/:id', (req, res, next) => {
    app.services.occupant.findOne({ id_viagem: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.occupant.create(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.delete('/:rideID/:userID', async (req, res, next) => {
    app.services.occupant.remove(req.params.rideID, req.params.userID)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};
