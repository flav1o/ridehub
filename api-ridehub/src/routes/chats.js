const express = require('express');

module.exports = (app) => {
  const router = express.Router();

  router.get('/:rideID/:chatID', (req, res, next) => {
    app.services.chat.findChatMessages(req.params.rideID, req.params.chatID)
      .then((result) => res.status(200).json(result))
      .catch((err) => next(err));
  });

  router.get('/:id', (req, res, next) => {
    app.services.chat.getChatID({ id_viagem: req.params.id })
      .then((result) => res.status(200).json(result[0]))
      .catch((err) => next(err));
  });

  router.post('/', async (req, res, next) => {
    try {
      const result = await app.services.chat.create(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  return router;
};
