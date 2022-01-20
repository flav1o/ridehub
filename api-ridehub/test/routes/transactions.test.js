const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');
const config = require('../../config');

const secret = config.authToken;

const ROUTE = '/v1/transaction';
let user;

beforeAll(async () => {
  const createUser = await app.services.user.create({
    nome: 'alberto',
    genero: 'M',
    descricao: 'descriptiontest TRANSACTIONS',
    email: `${Date.now()}@test.mail`,
    password: 'user12345',
    n_telemovel: Date.now(),
    saldo: 30,
    estado_conta: 'A',
  });

  user = { ...createUser[0] };
  user.token = jwt.encode(user, secret);
});

test('Test #1 - Listar as transações', () => {
  return request(app).get(ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThanOrEqual(0);
    });
});

test('Test #2 - Listar uma transação por ID de utilizador', () => {
  return request(app).get(`${ROUTE}/author/${user.id_utilizador}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(200);
    });
});

describe('Test #3 - Validação de parâmetros obrigatórios', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .send({
        data: Date.now(),
        montante: 30,
        tipo: 'I',
        id_utilizador: user.id_utilizador,
        ...data,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test #3.1 - Inserir uma transação sem data', () => testTemplate({ data: null }, 'A data é um campo obrigatorio'));
  test('Test #3.2 - Inserir uma transação sem montante', () => testTemplate({ montante: null }, 'O montante é um campo obrigatorio'));
  test('Test #3.3 - Inserir uma transação sem ID utilizador', () => testTemplate({ id_utilizador: null }, 'O ID de utilizador é um campo obrigatorio'));
  test('Test #3.4 - Inserir uma transação sem tipo', () => testTemplate({ tipo: null }, 'O tipo é um campo obrigatorio'));
  test('Test #3.5 - Inserir uma transação com tipo inválido', () => testTemplate({ tipo: 'X' }, 'O TIPO tem um valor inválido'));
});

test('Test #4 - Atualizar uma transação', () => {
  return app.db('transacoes').insert({
    data: Date.now(),
    montante: 30,
    tipo: 'I',
    id_utilizador: user.id_utilizador,
  }, ['id_utilizador']).then((result) => request(app).put(`${ROUTE}/${result[0].id_utilizador}`)
    .set('authorization', `bearer ${user.token}`)
    .send({ tipo: 'O' })
    .then((res) => {
      expect(res.status).toBe(204);
    }));
});
