exports.up = (knex) => {
  return knex.schema.alterTable('viagens', (table) => {
    table.integer('id_utilizador')
      .references('id_utilizador')
      .inTable('utilizadores')
      .notNull();
    table.integer('id_viatura')
      .references('id_viatura')
      .inTable('viaturas')
      .notNull();
  });
};

exports.down = (knex) => {

};
