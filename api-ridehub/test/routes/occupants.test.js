const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');
const config = require('../../config');

const secret = config.authToken;

const ROUTE = '/v1/occupant';

const matricula = `${Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString()
}-` + 'AZ'
  + `-${Math.floor(Math.random() * 9).toString()}${Math.floor(Math.random() * 9).toString()}`;
let user;
let vehicle;

beforeAll(async () => {
  const res = await app.services.user.create({
    nome: 'alberto',
    genero: 'M',
    descricao: 'descriptiontest OCCUPANTS',
    email: `${Date.now()}@test.mail`,
    password: 'user12345',
    n_telemovel: Date.now(),
    saldo: 30,
    estado_conta: 'A',
  });

  user = { ...res[0] };
  user.token = jwt.encode(user, secret);

  const createVehicle = await app.services.vehicle.create({
    marca: 'Audi',
    matricula,
    id_utilizador: user.id_utilizador,
  });
  vehicle = { ...createVehicle[0] };

  const createRide = await app.services.ride.create({
    id_viagem: 1,
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
});

test('Test #1 - Listar todos os ocupantes', () => {
  return request(app).get(ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test('Test #1.1 - Listar um entrada por ID de ocupante', () => {
  return app.db('ocupantes').insert({
    id_viagem: 1,
    id_utilizador: user.id_utilizador,
  }, ['id_ocupante'])
    .then((result) => request(app).get(`${ROUTE}/${result[0].id_ocupante}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id_viatura).toBe(result[0].id_viatura);
      }));
});

test('Test #1.1 - Listar uma entrada por ID de viagem', () => {
  return app.db('ocupantes').insert({
    id_viagem: 1,
    id_utilizador: user.id_utilizador,
  }, ['id_ocupante'])
    .then((result) => request(app).get(`${ROUTE}/${result[0].id_ocupante}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id_viatura).toBe(result[0].id_viatura);
      }));
});

describe('Test #2 - Validação de parâmetros obrigatórios', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({
        id_viagem: 1,
        id_utilizador: 1,
        ...data,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };
  test('Test #2.1 - Inserir ocupante sem ID viagem', () => testTemplate({ id_viagem: null }, 'O ID da viagem é um campo obrigatorio'));
  test('Test #2.2 - Inserir ocupante sem ID utilizador', () => testTemplate({ id_utilizador: null }, 'O ID de utilizador é um campo obrigatorio'));
});

test('Test #3 - Remover ocupante ', () => {
  return app.db('viagens').insert({
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
  }, ['id_viagem'])
    .then((result) => request(app).delete(`${ROUTE}/${result[0].id_viagem}/${user.id_utilizador}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(204);
      }));
});
