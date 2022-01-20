module.exports = (app) => {
  const findAll = async (filter = { }) => {
    filter *= 10;

    return app.db('viagens')
      .where({ estado: 'W' })
      .join('utilizadores', 'utilizadores.id_utilizador', 'viagens.id_utilizador')
      .join('viaturas', 'viaturas.id_viatura', 'viagens.id_viatura')
      .select(['viagens.id_viagem', 'viagens.origem', 'viagens.destino', 'viagens.data', 'utilizadores.nome', 'viagens.custo', 'viaturas.matricula', 'utilizadores.id_utilizador'])
      .limit(10)
      .offset(filter);
  };

  const searchOrder = async (filter = { }) => {
    return app.db('viagens')
      .where({ estado: 'W' })
      .join('utilizadores', 'utilizadores.id_utilizador', 'viagens.id_utilizador')
      .join('viaturas', 'viaturas.id_viatura', 'viagens.id_viatura')
      .select(['utilizadores.id_utilizador', 'viagens.id_viagem', 'viagens.origem', 'viagens.destino', 'viagens.data', 'utilizadores.nome', 'viagens.custo', 'viaturas.matricula'])
      .limit(10)
      .offset(filter.currentPage)
      .orderBy(filter.orderType, 'ASC');
  };

  const searchWord = async (filter = { }) => {
    return app.db('viagens')
      .where('viagens.estado', 'W')
      .where((bd) => {
        bd.orWhere('viagens.origem', 'like', `%${filter.word}%`)
          .orWhere('viagens.destino', 'like', `%${filter.word}%`)
          .orWhere('utilizadores.nome', 'like', `%${filter.word}%`)
          .orWhere('viagens.data', 'like', `%${filter.word}%`);
      })
      .join('utilizadores', 'utilizadores.id_utilizador', 'viagens.id_utilizador')
      .join('viaturas', 'viaturas.id_viatura', 'viagens.id_viatura')
      .select(['viagens.id_viagem', 'viagens.origem', 'viagens.destino', 'viagens.data', 'utilizadores.nome', 'viagens.custo', 'viaturas.matricula', 'utilizadores.id_utilizador']);
  };
  return { findAll, searchOrder, searchWord };
};
