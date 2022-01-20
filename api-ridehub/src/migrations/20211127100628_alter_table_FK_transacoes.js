exports.up = (knex) => {
  return knex.schema.alterTable('transacoes', (table) => {
    table.integer('id_utilizador')
      .references('id_utilizador')
      .inTable('utilizadores')
      .notNull();
  });
};

exports.down = (knex) => {

};
