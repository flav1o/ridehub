exports.up = function (knex, Promise) {
  return knex.schema.createTable('chat', (table) => {
    table.increments('id_mensagem').primary().notNull();
    table.string('data').notNull();
    table.string('id_chat', 150).notNull();
    table.integer('id_viagem').notNull();
    table.integer('id_utilizador')
      .references('id_utilizador')
      .inTable('utilizadores')
      .notNull();
    table.string('mensagem').notNull();
    table.enu('leftRide', ['N', 'Y']).notNull();
  });
};

exports.down = function (knex, Promise) {

};
