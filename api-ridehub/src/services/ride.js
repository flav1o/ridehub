const CryptoJS = require('crypto-js');
const ValidationError = require('../errors/validationError');
const config = require('../../config');

module.exports = (app) => {
  const findAll = (filter = {}) => {
    return app.db('viagens').where(filter).select(['id_viagem', 'data', 'origem', 'destino', 'custo', 'lugares_disponiveis', 'descricao', 'estado', 'id_utilizador', 'id_viatura', 'geo_origem', 'geo_destino']);
  };

  const findOne = (filter = {}) => {
    return app.db('viagens')
      .where(filter)
      .fullOuterJoin('utilizadores', 'utilizadores.id_utilizador', 'viagens.id_utilizador')
      .select(['id_viagem', 'data', 'origem', 'destino', 'custo', 'lugares_disponiveis', 'viagens.descricao', 'estado', 'viagens.id_utilizador', 'id_viatura', 'geo_origem', 'geo_destino', 'utilizadores.descricao as utilizadorDescricao', 'utilizadores.nome', 'utilizadores.n_telemovel'])
      .first();
  };

  const findOneAuthor = (filter = {}) => {
    return app.db('viagens')
      .where('viagens.id_utilizador', filter.id_utilizador)
      .fullOuterJoin('utilizadores', 'utilizadores.id_utilizador', 'viagens.id_utilizador')
      .select(['id_viagem', 'data', 'origem', 'destino', 'custo', 'lugares_disponiveis', 'viagens.descricao', 'estado', 'viagens.id_utilizador', 'id_viatura', 'geo_origem', 'geo_destino', 'utilizadores.descricao as utilizadorDescricao', 'utilizadores.nome', 'utilizadores.n_telemovel'])
      .first();
  };

  const create = async (viagens) => {
    if (!viagens.data) throw new ValidationError('A data é um campo obrigatorio');
    if (!viagens.origem) throw new ValidationError('A origem é um campo obrigatorio');
    if (!viagens.destino) throw new ValidationError('O destino é um campo obrigatorio');
    if (!viagens.custo) throw new ValidationError('O custo é um campo obrigatorio');
    if (!viagens.lugares_disponiveis) throw new ValidationError('Os lugares disponiveis é um campo obrigatorio');
    if (!viagens.descricao) throw new ValidationError('A descricao é um campo obrigatorio');
    if (!viagens.estado) throw new ValidationError('O estado é um campo obrigatorio');
    if (!viagens.id_utilizador) throw new ValidationError('O ID do utilizador é um campo obrigatorio');
    if (!viagens.id_viatura) throw new ValidationError('O ID da viatura é um campo obrigatorio');
    if (!viagens.geo_origem) throw new ValidationError('As coordenadas de origem são um campo obrigatorio');
    if (!viagens.geo_destino) throw new ValidationError('As coordenadas do destino são um campo obrigatorio');
    if (!viagens.id_chat) throw new ValidationError('O ID do chat é um campo obrigatorio');

    const generateURL = CryptoJS.AES.encrypt(Date.now().toString(), config.chatURL).toString();
    viagens.id_chat = encodeURIComponent(generateURL);

    return app.db('viagens')
      .insert({
        data: viagens.data,
        origem: viagens.origem,
        destino: viagens.destino,
        custo: viagens.custo,
        lugares_disponiveis: viagens.lugares_disponiveis,
        descricao: viagens.descricao,
        estado: viagens.estado,
        id_utilizador: viagens.id_utilizador,
        id_viatura: viagens.id_viatura,
        geo_origem: viagens.geo_origem,
        geo_destino: viagens.geo_destino,
        id_chat: viagens.id_chat,
      })
      .returning('id_viagem')
      .then((response) => {
        return app.db('ocupantes')
          .insert({ id_viagem: response[0], id_utilizador: viagens.id_utilizador });
      });
  };

  const remove = async (id_viagem) => {
    return app.db('viagens').where({ id_viagem }).del();
  };

  const update = (id_viagem, ride) => {
    return app.db('viagens').where({ id_viagem }).update(ride, ['id_viagem', 'data', 'origem', 'destino', 'custo', 'lugares_disponiveis', 'descricao', 'estado', 'id_utilizador', 'id_viatura', 'geo_origem', 'geo_destino', 'id_chat']);
  };

  const findOccupants = (filter = {}) => {
    return app.db('viagens')
      .fullOuterJoin('ocupantes', 'ocupantes.id_viagem', 'viagens.id_viagem')
      .fullOuterJoin('utilizadores', 'utilizadores.id_utilizador', 'ocupantes.id_utilizador')
      .select(['utilizadores.id_utilizador', 'utilizadores.descricao', 'utilizadores.nome', 'utilizadores.n_telemovel'])
      .where({ 'viagens.id_viagem': filter.id_viagem });
  };

  const toggleState = async (id_viagem, estado) => {
    if (!(estado == 'W' || estado == 'F' || estado == 'C' || estado == 'O')) { throw new ValidationError('O estado da viagem apenas pode ser "W" ou "F" ou "C" ou "O"'); }

    if (estado == 'F') {
      const nOccupants = await findOccupants({ id_viagem });

      const ride = await findOne({ id_viagem });

      if (nOccupants.length > 1) {
        const driverPayment = (nOccupants.length - 1) * ride.custo;

        const user = await app.db('utilizadores').where('id_utilizador', ride.id_utilizador).first();
        const saldo = user.saldo + driverPayment;

        await app.db('utilizadores').where('id_utilizador', user.id_utilizador).update({ saldo }, ['saldo'])
          .then(async () => {
            const transacao = {
              data: Date.now(),
              montante: driverPayment,
              tipo: 'I',
              id_utilizador: user.id_utilizador,
            };

            await app.db('transacoes').insert(transacao, ['data', 'montante', 'tipo', 'id_utilizador']);
          });
      }
    }

    return app.db('viagens').where({ id_viagem }).update({ estado }, ['estado']);
  };

  const findAmmount = (filter = {}) => {
    return app.db('viagens')
      .fullOuterJoin('ocupantes', 'ocupantes.id_viagem', 'viagens.id_viagem')
      .where({ 'viagens.id_viagem': filter.id_viagem })
      .countDistinct('ocupantes.id_utilizador as qnt')
      .select('viagens.lugares_disponiveis', 'viagens.estado')
      .groupBy('viagens.lugares_disponiveis', 'viagens.estado');
  };

  return {
    findAll, findOne, create, remove, update, findOccupants, findAmmount, toggleState, findOneAuthor,
  };
};
