/* eslint-disable no-plusplus */
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('avaliacao').where(filter).select(['id_avaliacao', 'nota', 'descricao', 'id_viagem', 'id_avaliador']);
  };

  const findOne = async (filter = {}) => {
    const result = await app.db('viagens')
      .join('utilizadores', 'utilizadores.id_utilizador', 'viagens.id_utilizador')
      .join('avaliacao', 'avaliacao.id_viagem', 'viagens.id_viagem')
      .where('viagens.id_utilizador', filter.id_utilizador)
      .select(['id_avaliacao', 'nota', 'avaliacao.descricao', 'avaliacao.id_avaliador']);

    for (let i = 0; i < result.length; i++) {
      const utilizador = await app.db('utilizadores').where('id_utilizador', result[i].id_avaliador).select('nome').first();
      result[i].nome = utilizador.nome;
    }

    return result;
  };

  const create = async (avaliacao) => {
    if (!avaliacao.nota) throw new ValidationError('A nota é um campo obrigatorio');
    if (!avaliacao.id_viagem) throw new ValidationError('O ID da viagem é um campo obrigatorio');
    if (!avaliacao.id_avaliador) throw new ValidationError('O ID do avaliador é um campo obrigatorio');
    if (avaliacao.nota > 5 || avaliacao.nota < 1) throw new ValidationError('A nota é um campo limitado entre 1 e 5');

    return app.db('avaliacao').insert(avaliacao, ['id_avaliacao', 'nota', 'descricao', 'id_viagem', 'id_avaliador']);
  };

  const findOneReview = async (id_viagem, id_utilizador) => {
    return app.db('avaliacao').where({ id_viagem }).where({ id_avaliador: id_utilizador }).count('avaliacao.id_avaliador');
  };

  return {
    findAll, findOne, create, findOneReview,
  };
};
