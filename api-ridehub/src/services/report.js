const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('reports').where(filter).select(['id_report', 'motivo', 'descricao', 'id_autor', 'id_reportado']);
  };

  const findOne = (filter = {}) => {
    return app.db('reports').where(filter).first();
  };

  const create = async (reports) => {
    if (!reports.motivo) throw new ValidationError('O motivo é um campo obrigatorio');
    if (!reports.id_autor) throw new ValidationError('O ID do autor é um campo obrigatorio');
    if (!reports.id_reportado) throw new ValidationError('O ID do reportado é um campo obrigatorio');

    return app.db('reports').insert(reports, ['id_report', 'motivo', 'descricao', 'id_autor', 'id_reportado']);
  };

  return { findAll, findOne, create };
};
