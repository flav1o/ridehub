const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('transacoes').where(filter).select(['id_transacao', 'data', 'montante', 'tipo', 'id_utilizador']);
  };

  const findUserTransactions = (filter = {}) => {
    return app.db('transacoes').where(filter).select(['id_transacao', 'data', 'montante', 'tipo']);
  };

  const create = async (transaction) => {
    if (!transaction.data) throw new ValidationError('A data é um campo obrigatorio');
    if (!transaction.montante) throw new ValidationError('O montante é um campo obrigatorio');
    if (!transaction.id_utilizador) throw new ValidationError('O ID de utilizador é um campo obrigatorio');
    if (!transaction.tipo) throw new ValidationError('O tipo é um campo obrigatorio');
    if (!(transaction.tipo === 'I' || transaction.tipo === 'O')) throw new ValidationError('O TIPO tem um valor inválido');

    const newTransaction = { ...transaction };

    if ((newTransaction.tipo === 'I' && newTransaction.montante < 0) || (newTransaction.tipo === 'O' && newTransaction.montante > 0)) {
      newTransaction.montante *= -1;
    }

    return app.db('transacoes').insert(newTransaction, ['id_transacao', 'data', 'montante', 'tipo', 'id_utilizador']);
  };

  const update = (id_transacao, transaction) => {
    return app.db('transacoes').where({ id_transacao }).update(transaction, ['id_transacao', 'data', 'montante', 'tipo', 'id_utilizador']);
  };

  return {
    findAll, findUserTransactions, create, update,
  };
};
