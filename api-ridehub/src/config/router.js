const express = require('express');

module.exports = (app) => {
  app.use('/auth', app.routes.auths);

  const secureRouter = express.Router();

  secureRouter.use('/users', app.routes.users);
  secureRouter.use('/evaluation', app.routes.evaluations);
  secureRouter.use('/report', app.routes.reports);
  secureRouter.use('/ride', app.routes.rides);
  secureRouter.use('/listed', app.routes.listeds);
  secureRouter.use('/transaction', app.routes.transactions);
  secureRouter.use('/vehicle', app.routes.vehicles);
  secureRouter.use('/occupant', app.routes.occupants);
  secureRouter.use('/chat', app.routes.chats);

  app.use('/v1', app.config.passport.authenticate(), secureRouter);
};
