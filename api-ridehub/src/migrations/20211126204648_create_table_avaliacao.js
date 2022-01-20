exports.up = (knex) => {
  return knex.schema.createTable('avaliacao', (table) => {
    table.increments('id_avaliacao').primary().notNull();
    table.integer('nota').notNull();
    table.string('descricao', 120);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('avaliacao');
};
