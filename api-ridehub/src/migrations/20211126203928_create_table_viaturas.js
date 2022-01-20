exports.up = (knex) => {
  return knex.schema.createTable('viaturas', (table) => {
    table.increments('id_viatura').primary().notNull();
    table.string('marca', 50).notNull();
    table.string('matricula', 8).notNull().unique();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('viaturas');
};
