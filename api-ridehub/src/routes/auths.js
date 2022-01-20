const express = require('express');
const jwt = require('jwt-simple');
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');
const config = require('../../config');

const secret = config.authToken;

module.exports = (app) => {
  const router = express.Router();

  router.post('/signin', (req, res, next) => {
    app.services.user.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) throw new ValidationError('Autenticação inválida! #2');

        const {
          id_utilizador, email, n_telemovel,
        } = user;

        if (bcrypt.compareSync(req.body.password, user.password)) {
          const payload = {
            id_utilizador,
            email,
            n_telemovel,
          };

          const token = jwt.encode(payload, secret);
          res.status(200).json({ token });
        } else throw new ValidationError('Autenticação inválida!');
      }).catch((err) => next(err));
  });

  router.post('/signup', async (req, res, next) => {
    try {
      const result = await app.services.user.create(req.body);
      return res.status(201).json(result[0]);
    } catch (err) {
      return next(err);
    }
  });

  router.put('/forget-password', (req, res, next) => {
    app.services.user.forgotPassword(req.body)
      .then(() => res.status(204).send())
      .catch((err) => next(err));
  });

  return router;
};
