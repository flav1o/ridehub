exports.up = (knex) => {
  return knex.schema.alterTable('reports', (table) => {
    table.integer('id_autor')
      .references('id_utilizador')
      .inTable('utilizadores')
      .notNull();
    table.integer('id_reportado')
      .references('id_utilizador')
      .inTable('utilizadores')
      .notNull();
  });
};

exports.down = (knex) => {

};
