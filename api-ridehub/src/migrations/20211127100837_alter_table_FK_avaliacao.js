exports.up = (knex) => {
  return knex.schema.alterTable('avaliacao', (table) => {
    table.integer('id_viagem')
      .references('id_viagem')
      .inTable('viagens')
      .notNull();
    table.integer('id_avaliador')
      .references('id_utilizador')
      .inTable('utilizadores')
      .notNull();
  });
};

exports.down = (knex) => {

};
