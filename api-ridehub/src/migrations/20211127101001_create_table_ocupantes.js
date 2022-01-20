exports.up = (knex) => {
  return knex.schema.createTable('ocupantes', (table) => {
    table.increments('id_ocupante').primary().notNull();
    table.integer('id_viagem')
      .references('id_viagem')
      .inTable('viagens')
      .notNull();
    table.integer('id_utilizador')
      .references('id_utilizador')
      .inTable('utilizadores')
      .notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('ocupantes');
};
