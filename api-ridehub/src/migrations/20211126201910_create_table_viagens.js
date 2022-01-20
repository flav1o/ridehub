exports.up = (knex) => {
  return knex.schema.createTable('viagens', (table) => {
    table.increments('id_viagem').primary().notNull();
    table.string('data', 200).notNull();
    table.string('origem', 150).notNull();
    table.string('destino', 150).notNull();
    table.double('custo').notNull();
    table.integer('lugares_disponiveis').notNull();
    table.string('descricao', 100).notNull();
    table.enu('estado', ['W', 'O', 'F', 'C']).notNull();
    table.string('geo_origem').notNull();
    table.string('geo_destino').notNull();
    table.string('id_chat', 150).notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('viagens');
};
