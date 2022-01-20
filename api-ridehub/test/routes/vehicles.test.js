const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');
const config = require('../../config');

const secret = config.authToken;
const ROUTE = '/v1/vehicle';

let user;
let matricula;

beforeAll(async () => {
  const res = await app.services.user.create({
    nome: 'alberto',
    genero: 'M',
    descricao: 'descriptiontest VEHICLES',
    email: `${Date.now()}@test.mail`,
    password: 'user12345',
    n_telemovel: Date.now(),
    saldo: 30,
    estado_conta: 'A',
  });

  user = { ...res[0] };
  user.token = jwt.encode(user, secret);
});

beforeEach(() => {
  matricula = `${Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString()
  }-` + 'AZ'
  + `-${Math.floor(Math.random() * 9).toString()}${Math.floor(Math.random() * 9).toString()}`;
});

test('Test #1 - Listar as viaturas', () => {
  return request(app).get(ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test('Test #1.1 - Listar uma viatura por ID', () => {
  return app.db('viaturas').insert({
    marca: 'Audi',
    matricula,
    id_utilizador: user.id_utilizador,
  }, ['id_viatura'])
    .then((result) => request(app).get(`${ROUTE}/${result[0].id_viatura}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id_viatura).toBe(result[0].id_viatura);
      }));
});

test('Test #1.2 - Listar uma viatura por ID de utilizador', () => {
  return app.db('viaturas').insert({
    marca: 'Audi',
    matricula,
    id_utilizador: user.id_utilizador,
  }, ['id_utilizador'])
    .then((result) => request(app).get(`${ROUTE}/owner/${result[0].id_utilizador}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body[0].id_utilizador).toBe(result[0].id_utilizador);
      }));
});

test('Test #2 - Inserir uma viatura', () => {
  return request(app).post(ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      marca: 'Audi',
      matricula,
      id_utilizador: user.id_utilizador,
    })
    .then((res) => {
      expect(res.status).toBe(201);
    });
});

describe('Test #3 - Validação de parâmetros obrigatórios', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({
        marca: 'Audi',
        matricula,
        id_utilizador: user.id_utilizador,
        ...data,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test #3.1 - Inserir veículo sem marca', () => testTemplate({ marca: null }, 'A marca é um campo obrigatorio'));

  test('Test #3.2 - Inserir veículo sem matricula', () => testTemplate({ matricula: null }, 'A matricula é um campo obrigatorio'));

  test('Test #3.2 - Inserir veículo sem ID de utilizador', () => testTemplate({ id_utilizador: null }, 'O ID de utilizador é um campo obrigatorio'));
});

test('Test #4 - Remover uma viatura', () => {
  return app.db('viaturas').insert({
    marca: 'OPEL',
    matricula: '94-32-FF',
    id_utilizador: user.id_utilizador,
  }, ['id_viatura']).then((result) => request(app).delete(`${ROUTE}/${result[0].id_viatura}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    }));
});

test('Test #5 - Atualizar viatura', () => {
  return app.db('viaturas').insert({
    marca: 'BMW',
    matricula,
    id_utilizador: user.id_utilizador,
  }, ['id_viatura'])
    .then((result) => request(app).put(`${ROUTE}/${result[0].id_viatura}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ matricula })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.id_viatura).toBe(result[0].id_viatura);
        expect(res.body.matricula).toBe(matricula);
      }));
});

test('Teste #6 - Validar matriculas duplicadas', () => {
  return request(app).post(ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      marca: 'BMW',
      matricula: 'KJ-32-82',
      id_utilizador: user.id_utilizador,
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Matricula duplicada');
    });
});
