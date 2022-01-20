const ValidationError = require('../errors/validationError');

const licenseRegex = /(^(?:[A-Z]{2}-\d{2}-\d{2})|(?:\d{2}-[A-Z]{2}-\d{2})|(?:\d{2}-\d{2}-[A-Z]{2})$)/gm;

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('viaturas').where(filter).select(['id_viatura', 'marca', 'matricula', 'id_utilizador']);
  };

  const findOne = (filter = {}) => {
    return app.db('viaturas').where(filter).first();
  };

  const findOneOwner = (filter = {}) => {
    return app.db('viaturas').where(filter);
  };

  const create = async (vehicle) => {
    if (!vehicle.marca) throw new ValidationError('A marca é um campo obrigatorio');
    if (!vehicle.matricula) throw new ValidationError('A matricula é um campo obrigatorio');
    if (!vehicle.id_utilizador) throw new ValidationError('O ID de utilizador é um campo obrigatorio');
    const vehicleMatricula = await findOne({ matricula: vehicle.matricula });
    if (vehicleMatricula) throw new ValidationError('Matricula duplicada');
    if (!licenseRegex.test(vehicle.matricula)) throw new ValidationError('A matrícula não segue os padrões convencionais!');

    return app.db('viaturas').insert(vehicle, ['id_viatura', 'marca', 'matricula', 'id_utilizador']);
  };

  const remove = (id_viatura) => {
    return app.db('viaturas').where({ id_viatura }).del();
  };

  const update = (id_viatura, vehicle) => {
    return app.db('viaturas').where({ id_viatura }).update(vehicle, ['id_viatura', 'marca', 'matricula', 'id_utilizador']);
  };

  return {
    findAll, findOne, create, remove, update, findOneOwner,
  };
};
