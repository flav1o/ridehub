exports.up = (knex) => {
  return knex.schema.createTable('transacoes', (table) => {
    table.increments('id_transacao').primary().notNull();
    table.string('data', 200).notNull();
    table.double('montante').notNull();
    table.enu('tipo', ['I', 'O']).notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('transacoes');
};
