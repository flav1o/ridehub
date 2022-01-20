const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');
const config = require('../../config');

const secret = config.authToken;

const ROUTE = '/v1/users';
let userA;

beforeAll(async () => {
  const createUserA = await app.services.user.create({
    nome: 'alberto',
    genero: 'M',
    descricao: 'descriptiontest USERS',
    email: `${Date.now()}@test.mail`,
    password: 'user12345',
    n_telemovel: Date.now(),
    saldo: 30,
    estado_conta: 'A',
  });

  userA = { ...createUserA[0] };
  userA.token = jwt.encode(userA, secret);
});

test('Test #1 - Listar os utilizadores', () => {
  return request(app).get(ROUTE)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #1.1 - Listar utilizador por ID', () => {
  return request(app).get(`${ROUTE}/${userA.id_utilizador}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.nome).toBe('alberto');
    });
});

test('Test #1.2 - Listar saldo do utilizador por ID', () => {
  return request(app).get(`${ROUTE}/money/${userA.id_utilizador}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.saldo).toBe(userA.saldo);
    });
});

test('Test #1.3 - Listar viagens que o utilizador é o condutor', () => {
  return request(app).get(`${ROUTE}/driver/${userA.id_utilizador}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Test #1.4 - Listar viagens activas do utilizador', () => {
  return request(app).get(`${ROUTE}/active/${userA.id_utilizador}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

test('Test #1.5 - Listar os novos utilizadores', () => {
  return request(app).get(`${ROUTE}/activeUsers/newcomers`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #1.6 - Listar os utilizadores por nome', () => {
  return request(app).get(`${ROUTE}/activeUsers/searchByName?nome=${userA.nome}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });
});

test('Test #2 - Atualizar dados de um utilizador', () => {
  return app.db('utilizadores').insert({
    nome: 'Alberto',
    genero: 'NS',
    descricao: 'asd',
    email: `${Date.now()}@test.mail`,
    password: '12345',
    n_telemovel: Date.now(),
    saldo: 40,
    estado_conta: 'A',
  }, ['id_utilizador']).then((result) => request(app).put(`${ROUTE}/${result[0].id_utilizador}`)
    .set('authorization', `bearer ${userA.token}`)
    .send({ nome: 'User Updated' })
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body[0].nome).toBe('User Updated');
    }));
});

test('Test #3 - Desativar conta de um utilizador', () => {
  return app.db('utilizadores').insert({
    nome: 'Alberto',
    genero: 'NS',
    descricao: 'asd',
    email: `${Date.now()}@test.mail`,
    password: '12345',
    n_telemovel: Date.now(),
    saldo: 40,
    estado_conta: 'A',
  }, ['id_utilizador']).then((result) => request(app).patch(`${ROUTE}/${result[0].id_utilizador}`)
    .set('authorization', `bearer ${userA.token}`)
    .send({ estado_conta: 'D' })
    .then((res) => {
      expect(res.status).toBe(204);
    }));
});

test('Test #4 - Apagar utilizador', () => {
  return app.db('utilizadores').insert({
    nome: 'Alberto',
    genero: 'NS',
    descricao: 'asd',
    email: `${Date.now()}@test.mail`,
    password: '12345',
    n_telemovel: Date.now(),
    saldo: 40,
    estado_conta: 'A',
  }, ['id_utilizador']).then((result) => request(app).delete(`${ROUTE}/${result[0].id_utilizador}`)
    .set('authorization', `bearer ${userA.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    }));
});
