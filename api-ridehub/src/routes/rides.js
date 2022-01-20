const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/', (req, res, next) => {
    app.services.ride.findAll()
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.ride.findOne({ id_viagem: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/occupants/:id', (req, res, next) => {
    app.services.ride.findOccupants({ id_viagem: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/ammount/:id', (req, res, next) => {
    app.services.ride.findAmmount({ id_viagem: req.params.id })
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.get('/author/:id', (req, res, next) => {
    app.services.ride.findOneAuthor({ id_utilizador: req.params.id })
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.ride.create(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.delete('/:id', (req, res, next) => {
    app.services.ride.remove(req.params.id)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  router.put('/:id', (req, res, next) => {
    app.services.ride.update(req.params.id, req.body)
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.put('/state/:id', (req, res, next) => {
    console.log(req.body);
    app.services.ride.toggleState(req.params.id, req.body.estado)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  return router;
};
