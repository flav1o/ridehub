const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');
const config = require('../../config');

const matricula = `${Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString()
}-` + 'AZ'
                + `-${Math.floor(Math.random() * 9).toString()}${Math.floor(Math.random() * 9).toString()}`;

const secret = config.authToken;
const ROUTE = '/v1/evaluation';

let user;
let vehicle;
let ride;
let evaluation;

beforeAll(async () => {
  const createUser = await app.services.user.create({
    nome: 'alberto',
    genero: 'M',
    descricao: 'descriptiontest EVALUATION',
    email: `${Date.now()}@test.mail`,
    password: 'User12345',
    n_telemovel: Date.now(),
    saldo: 30,
    estado_conta: 'A',
  });

  user = { ...createUser[0] };
  user.token = jwt.encode(user, secret);

  const createVehicle = await app.services.vehicle.create({
    marca: 'Audi',
    matricula,
    id_utilizador: user.id_utilizador,
  });

  vehicle = { ...createVehicle[0] };

  const createRide = await app.services.ride.create({
    data: Date.now(),
    origem: 'Porto',
    destino: 'Braga',
    custo: 30,
    lugares_disponiveis: 5,
    descricao: 'Carrinha MUITO GRANDE',
    estado: 'W',
    id_utilizador: user.id_utilizador,
    id_viatura: vehicle.id_viatura,
    geo_origem: '-8.3864703,41.551471',
    geo_destino: '-8.3864703,41.5514713',
    id_chat: '1',
  });

  ride = { ...createRide[0] };

  const createEvaluation = await app.services.evaluation.create({
    nota: 5,
    descricao: 'Uma avaliação',
    id_viagem: 1,
    id_avaliador: user.id_utilizador,
  });

  evaluation = { ...createEvaluation[0] };
});

test('Test #1 - Listar as avaliações', () => {
  return request(app).get(ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test('Test #1.1 - Listar uma avaliação por ID', () => {
  return app.db('avaliacao').insert({
    nota: 5,
    descricao: 'Uma avaliação',
    id_viagem: 1,
    id_avaliador: user.id_utilizador,
  }, ['id_avaliacao'])
    .then((result) => request(app).get(`${ROUTE}/${result[0].id_avaliacao}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.nota).toBe(result[0].nota);
      }));
});

test('Test #1.2 - Listar uma avaliação por ID de viagem e utilizador', () => {
  return request(app).get(`${ROUTE}/author/${evaluation.id_viagem}/${evaluation.id_avaliador}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).not.toBeUndefined();
    });
});

describe('Test #2 - Validação de parâmetros obrigatórios', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({
        id_avaliacao: 1,
        nota: 3,
        descricao: 'Denuncia',
        id_viagem: 1,
        id_avaliador: user.id_utilizador,
        ...data,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test #2.1 - Inserir avaliação sem nota', () => testTemplate({ nota: null }, 'A nota é um campo obrigatorio'));
  test('Test #2.2 - Inserir avaliação sem ID viagem', () => testTemplate({ id_viagem: null }, 'O ID da viagem é um campo obrigatorio'));
  test('Test #2.1 - Inserir avaliação sem ID avaliador', () => testTemplate({ id_avaliador: null }, 'O ID do avaliador é um campo obrigatorio'));
  test('Test #2.1 - Inserir avaliação com nota incorreta', () => testTemplate({ nota: 6 }, 'A nota é um campo limitado entre 1 e 5'));
});
