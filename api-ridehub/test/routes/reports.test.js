const request = require('supertest');
const jwt = require('jwt-simple');
const app = require('../../src/app');
const config = require('../../config');

const secret = config.authToken;
const ROUTE = '/v1/report';
let reportado;
let autor;
let report;

beforeAll(async () => {
  const createUserA = await app.services.user.create({
    nome: 'alberto',
    genero: 'M',
    descricao: 'descriptiontest REPORTS',
    email: `${Date.now()}@test.mail`,
    password: 'user12345',
    n_telemovel: Date.now(),
    saldo: 30,
    estado_conta: 'A',
  });
  const createUserB = await app.services.user.create({
    nome: 'alberto',
    genero: 'M',
    descricao: 'descriptiontest Reportado',
    email: `${Date.now()}@test.mail`,
    password: 'user12345',
    n_telemovel: Date.now(),
    saldo: 30,
    estado_conta: 'A',
  });

  autor = { ...createUserA[0] };
  reportado = { ...createUserB[0] };
  autor.token = jwt.encode(autor, secret);
  reportado.token = jwt.encode(reportado, secret);

  const createReport = await app.services.report.create({
    motivo: 'Denuncia',
    descricao: 'Denuncia Para Teste',
    id_autor: autor.id_utilizador,
    id_reportado: reportado.id_utilizador,
  });

  report = { ...createReport[0] };
});

describe('Test #1 - Listar denúncias', () => {
  test('Test #1.1 - Listar todas as denúncias', () => {
    return request(app).get(ROUTE)
      .set('authorization', `bearer ${autor.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
      });
  });

  test('Test #1.2 - Listar uma denúncia por ID', () => {
    return request(app).get(`${ROUTE}/${report.id_report}`)
      .set('authorization', `bearer ${autor.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.descricao).toBe('Denuncia Para Teste');
      });
  });

  test('Test #1.3 - Listar uma denúncia por ID de autor', () => {
    return request(app).get(`${ROUTE}/author/${report.id_autor}`)
      .set('authorization', `bearer ${autor.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});

test('Test #2 - Inserir uma denúncia', () => {
  return request(app).post(ROUTE)
    .set('authorization', `bearer ${autor.token}`)
    .send({
      motivo: 'Denuncia',
      descricao: 'Denuncia',
      id_autor: autor.id_utilizador,
      id_reportado: reportado.id_utilizador,
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.motivo).toBe('Denuncia');
    });
});

describe('Test #3 - Validação de parâmetros obrigatórios', () => {
  const testTemplate = (data, errorMessage) => {
    return request(app).post(ROUTE)
      .set('authorization', `bearer ${autor.token}`)
      .send({
        motivo: 'Denuncia',
        descricao: 'Denuncia',
        id_autor: autor.id_utilizador,
        id_reportado: reportado.id_utilizador,
        ...data,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test #3.1 - Inserir um report sem motivo', () => testTemplate({ motivo: null }, 'O motivo é um campo obrigatorio'));

  test('Test #3.2 - Inserir um report sem ID do autor', () => testTemplate({ id_autor: null }, 'O ID do autor é um campo obrigatorio'));

  test('Test #3.3 - Inserir um report sem ID reportado', () => testTemplate({ id_reportado: null }, 'O ID do reportado é um campo obrigatorio'));
});
