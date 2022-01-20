const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('ocupantes').where(filter).select(['id_ocupante', 'id_viagem', 'id_utilizador']);
  };

  const findOne = (filter = {}) => {
    return app.db('ocupantes').where(filter).first();
  };

  const create = async (occupant) => {
    if (!occupant.id_viagem) throw new ValidationError('O ID da viagem é um campo obrigatorio');
    if (!occupant.id_utilizador) throw new ValidationError('O ID de utilizador é um campo obrigatorio');

    return app.db('ocupantes').insert(occupant, ['id_ocupante', 'id_viagem', 'id_utilizador']);
  };

  const remove = async (id_viagem, id_utilizador) => {
    return app.db('ocupantes')
      .where({ id_viagem }).where({ id_utilizador })
      .del()
      .then(() => {
        return app.db('chat')
          .where({ id_viagem }).where({ id_utilizador })
          .update('leftRide', 'Y');
      });
  };

  return {
    findAll, findOne, create, remove,
  };
};
