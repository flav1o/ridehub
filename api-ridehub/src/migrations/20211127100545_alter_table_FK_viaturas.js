exports.up = (knex) => {
  return knex.schema.alterTable('viaturas', (table) => {
    table.integer('id_utilizador')
      .references('id_utilizador')
      .inTable('utilizadores')
      .notNull();
  });
};

exports.down = (knex) => {

};
