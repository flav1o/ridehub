module.exports = (app) => {
  // AUTH
  app.route('/auth/signin')
    .post(app.routes.auths.signin);

  app.route('/auth/signup')
    .post(app.routes.auths.signup);

  app.route('/auth/forget-password')
    .put(app.routes.users.forgotPassword());

  // USERS
  app.route('/users')
    .all(app.config.passport.authenticate())
    .post(app.routes.users.create);

  app.route('/users/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.findOne)
    .put(app.routes.users.update)
    .delete(app.routes.users.remove)
    .patch(app.routes.users.deactivateAccount);

  app.route('/users/money/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.userMoney);

  app.route('/users/driver/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.rideDriver);

  app.route('/users/active/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.activeRides);

  app.route('/users/activeUsers/newcomers')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.activeUsers);

  app.route('/users/activeUsers/searchByName')
    .all(app.config.passport.authenticate())
    .get(app.routes.users.activeUsers);

  app.route('/users/balance/:userID')
    .all(app.config.passport.authenticate())
    .put(app.routes.users.updateUserMoney);

  // EVALUATION
  app.route('/evaluation')
    .all(app.config.passport.authenticate())
    .get(app.routes.evaluations.findAll)
    .post(app.routes.evaluations.create);

  app.route('/evaluation/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.evaluations.findOne);

  app.route('/evaluation/author/:rideID/:userID')
    .all(app.config.passport.authenticate())
    .get(app.routes.evaluations.findOneReview);

  // REPORT
  app.route('/report')
    .all(app.config.passport.authenticate())
    .get(app.routes.reports.findAll)
    .post(app.routes.reports.create);

  app.route('/report/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.reports.findOne);

  app.route('/report/author/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.reports.findOneAuthor);

  // RIDE
  app.route('/ride')
    .all(app.config.passport.authenticate())
    .get(app.routes.rides.findAll)
    .post(app.routes.rides.create);

  app.route('/ride/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.rides.findOne)
    .put(app.routes.rides.update)
    .delete(app.routes.rides.remove);

  app.route('/ride/author/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.rides.findOneAuthor);

  app.route('/ride/occupants/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.rides.findOccupants);

  app.route('/ride/ammount/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.rides.findAmmount);

  app.route('/ride/state/:id')
    .all(app.config.passport.authenticate())
    .put(app.routes.rides.toggleState);

  // TRANSACTION
  app.route('/transaction')
    .all(app.config.passport.authenticate())
    .get(app.routes.transactions.findAll)
    .post(app.routes.transactions.create);

  app.route('/transaction/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.transactions.findOne)
    .put(app.routes.transactions.update);

  app.route('/transaction/author/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.transactions.findUserTransactions);

  // VEHICLE
  app.route('/vehicle')
    .all(app.config.passport.authenticate())
    .get(app.routes.vehicles.findAll)
    .post(app.routes.vehicles.create);

  app.route('/vehicle/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.vehicles.findOne)
    .delete(app.routes.vehicles.remove)
    .put(app.routes.vehicles.update);

  app.route('/vehicle/owner/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.vehicles.findOneOwner);

  // OCCUPANTS
  app.route('/occupant')
    .all(app.config.passport.authenticate())
    .get(app.routes.occupants.findAll)
    .post(app.routes.occupants.create);

  app.route('/occupant/ride/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.occupants.findOne);

  app.route('/occupant/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.occupants.findOne);

  app.route('/occupant/:rideID/:userID')
    .all(app.config.passport.authenticate())
    .delete(app.routes.occupants.remove);

  // LIST
  app.route('/listed/:page')
    .all(app.config.passport.authenticate())
    .get(app.routes.listeds.findAll);

  app.route('/listed/search/:page')
    .all(app.config.passport.authenticate())
    .get(app.routes.listeds.searchOrder);

  app.route('/listed/search/word/:type')
    .all(app.config.passport.authenticate())
    .get(app.routes.listeds.searchWord);

  // CHAT
  app.route('/chat')
    .all(app.config.passport.authenticate())
    .post(app.routes.chats.create);

  app.route('/chat/:rideID/:chatID')
    .all(app.config.passport.authenticate())
    .get(app.routes.chats.findChatMessages);

  app.route('/chat/:id')
    .all(app.config.passport.authenticate())
    .get(app.routes.chats.getChatID);
};
