exports.up = (knex) => {
  return knex.schema.createTable('reports', (table) => {
    table.increments('id_report').primary().notNull();
    table.string('motivo', 50).notNull();
    table.string('descricao', 200);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('reports');
};
