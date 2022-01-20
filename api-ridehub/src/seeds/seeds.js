exports.seed = (knex) => {
  return knex('utilizadores').del().insert([
    {
      nome: 'Flavio', genero: 'M', descricao: 'Rei do Discord', email: 'fla1@gmail.com', password: '$2a$10$CDZc6OR0hzX7vkXWUC5hruObLVrcBIkXaskDpvBAL5ZA6tCBwjGK2', n_telemovel: '913977179', saldo: 10, estado_conta: 'A',
    },
    {
      nome: 'Joao', genero: 'M', descricao: 'Beer King', email: 'jmbantunes2@gmail.com', password: '$2a$10$g1QjPm53UQd1fEN8HLiaaeZ/Yo6v6v9tfsJCK/1mVn9YKSCwaqBIe', n_telemovel: '925815532', saldo: 20, estado_conta: 'A',
    },
    {
      nome: 'Jose', genero: 'F', descricao: 'Rei da Bola', email: 'jose_pedro77@hotmail.com', password: '$2a$10$x3E.SV6w1Cggq8J5wf/30.SiYDnHy6SIE4MVOjO0CKmbe00wKTVyK', n_telemovel: '912688898', saldo: 80, estado_conta: 'A',
    },
    {
      nome: 'Sergio', genero: 'M', descricao: 'Principe do Discord', email: 'a20365@alunos.ipca.pt', password: '$2a$10$eyc2FK8WXnpQicYUrGm5SeoNq85RZ4PtN5DYDsJNVrPnNERKoCU9O', n_telemovel: '963621273', saldo: 5, estado_conta: 'A',
    },
    {
      nome: 'Alberto Teste', genero: 'M', descricao: 'Homem Do Serviço', email: 'test@test.com', password: '$2a$10$edc2FK8WXnpQicYUrGm5SeoNq85RZ4PtN5DYDsJNVrPnNERKoCU9O', n_telemovel: '123456789', saldo: 15, estado_conta: 'A',
    },
    {
      nome: 'Bruno', genero: 'M', descricao: 'Homem Do Serviço', email: 'test2@test.com', password: '$2a$10$edc2FK8WXnpQicYUrGm5SeoNq85RZ4PtN5DYDsJNVrPnNERKoCU9O', n_telemovel: '323456789', saldo: 15, estado_conta: 'A',
    },
    {
      nome: 'tone', genero: 'M', descricao: 'Homem Do Serviço', email: 'tone@gmail.com', password: '$2a$10$fOq6X6ZW99WjhR4QdeV1.OEHLWAo81aKx4gIFQP.mUiJMlkRWkfom', n_telemovel: '323486789', saldo: 3000000, estado_conta: 'A',
    },
  ])
    .then(() => knex('viaturas').del().insert([
      {
        marca: 'Audi', matricula: 'KJ-32-82', id_utilizador: 1,
      },
      {
        marca: 'BMW', matricula: 'SC-32-65', id_utilizador: 2,
      },
      {
        marca: 'KIA', matricula: 'OL-54-AS', id_utilizador: 3,
      },
      {
        marca: 'Opel', matricula: 'GH-54-TR', id_utilizador: 4,
      },
      {
        marca: 'Ferrari', matricula: 'AA-55-TT', id_utilizador: 5,
      },
      {
        marca: 'RollRoy', matricula: 'TO-NE-42', id_utilizador: 7,
      },
    ]))
    .then(() => knex('viagens').del().insert([
      {
        data: '2021-08-16T18:12', origem: 'Braga', destino: 'Braga', custo: 40, lugares_disponiveis: 5, descricao: 'Lisboa -> Bragança', estado: 'O', id_utilizador: 2, id_viatura: 2, geo_origem: '-8.4207617,41.5474685', geo_destino: '-8.4336785,41.5439461', id_chat: 'U2FsdGVkX1%2BZi%2BJvtYlyQN1qaK7eHu2j%2FAgpwAG08W4%3D',
      },
      {
        data: '2021-08-12T13:42', origem: 'Barcelos', destino: 'Vila Nova Famalicão', custo: 25, lugares_disponiveis: 4, descricao: 'Viseu -> Portalegre', estado: 'F', id_utilizador: 3, id_viatura: 3, geo_origem: '-8.6279089,41.5371497', geo_destino: '-8.4790041,41.4400219', id_chat: 'U2FsdGVkX1%2BZi%2BJvtYlyQN1qaK7eHu2j%2FAgpwAG08W4%3q',
      },
      {
        data: '2021-21-22T33:42', origem: 'Barcelos', destino: 'Vila Nova Famalicão', custo: 25, lugares_disponiveis: 4, descricao: 'Algarve -> Tejo', estado: 'W', id_utilizador: 5, id_viatura: 5, geo_origem: '-8.6279089,41.5371497', geo_destino: '-8.4790041,41.4400219', id_chat: 'U2FsdGVkX1%2BZi%2BJvtYlyQN1qaK7eHu2j%2FAgpwAG08W4%3a',
      },
    ]))
    .then(() => knex('avaliacao').del().insert([
      {
        nota: 3, descricao: 'Não gostei muito da música', id_viagem: 1, id_avaliador: 1,
      },
      {
        nota: 1, descricao: 'Péssima condução', id_viagem: 1, id_avaliador: 2,
      },
      {
        nota: 5, descricao: 'Adorei a companhia', id_viagem: 3, id_avaliador: 3,
      },
      {
        nota: 4, descricao: 'Péssimos passageiros', id_viagem: 3, id_avaliador: 3,
      },
    ]))
    .then(() => knex('reports').del().insert([
      {
        motivo: 'Insultos', descricao: 'Insultou-me durante a viagem', id_autor: 1, id_reportado: 3,
      },
      {
        motivo: 'Arrogância', descricao: 'Pessoa altamente arrogante', id_autor: 2, id_reportado: 4,
      },
      {
        motivo: 'Racismo', descricao: 'Conversa demasiado racista', id_autor: 2, id_reportado: 3,
      },
      {
        motivo: 'Preconceito', descricao: 'Pessoa altamente preconceituosa', id_autor: 1, id_reportado: 4,
      },
    ]))
    .then(() => knex('transacoes').del().insert([
      {
        data: Date.now(), montante: 25, tipo: 'I', id_utilizador: 1,
      },
      {
        data: Date.now(), montante: 15, tipo: 'O', id_utilizador: 1,
      },
      {
        data: Date.now(), montante: 20, tipo: 'I', id_utilizador: 1,
      },
    ]));
};
