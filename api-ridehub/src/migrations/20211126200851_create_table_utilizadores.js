exports.up = (knex) => {
  return knex.schema.createTable('utilizadores', (table) => {
    table.increments('id_utilizador').primary().notNull();
    table.string('nome', 50).notNull();
    table.enu('genero', ['M', 'F', 'NS']).notNull();
    table.string('descricao', 200).notNull();
    table.string('email', 200).notNull().unique();
    table.string('password', 64).notNull();
    table.string('n_telemovel', 15).notNull().unique();
    table.double('saldo').notNull();
    table.enu('estado_conta', ['A', 'D']).notNull();
    table.string('instagram', 150);
    table.string('twitter', 150);
    table.string('snapchat', 150);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('utilizadores');
};
