const request = require('supertest');
const app = require('../../src/app');

const email = `${Date.now()}@ipca.pt`;
const n_telemovel = Date.now();

test('Test #1 - Receber token ao autenticar', () => {
  return app.services.user.create(
    {
      nome: 'UserTest',
      genero: 'NS',
      descricao: 'asd',
      email,
      password: 'user12345',
      n_telemovel,
      saldo: 40,
      estado_conta: 'A',
    },
  ).then(() => request(app).post('/auth/signin')
    .send({ email, password: 'user12345' }))
    .then((res) => {
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
});

test('Test #2 - Aceder a rotas protegidas', () => {
  return request(app).get('/v1/users')
    .then((res) => {
      expect(res.status).toBe(401);
    });
});

test('Test #3 - Tentativa de autenticação com utilizador errado', () => {
  const fakeEmail = `${Date.now()}@ipca.com`;
  return request(app).post('/auth/signin')
    .send({ email: fakeEmail, password: '11' })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação inválida! #2');
    });
});

test('Test #4 - Tentativa de autenticaçao errada', () => {
  return app.services.user.create({
    nome: 'Alberto',
    genero: 'NS',
    descricao: 'asd',
    email: `${Date.now()}@test.mail`,
    password: 'user12345',
    n_telemovel: Date.now(),
    saldo: 40,
    estado_conta: 'A',
  }).then(() => request(app).post('/auth/signin')
    .send({
      nome: 'Alberto',
      genero: 'NS',
      descricao: 'asd',
      email: `${Date.now()}@test.mail`,
      password: 'wrongpassword1',
      n_telemovel: Date.now(),
      saldo: 40,
      estado_conta: 'A',
    }))
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Autenticação inválida! #2');
    });
});

test('Test #5 - Criar utilizador', () => {
  return request(app).post('/auth/signup')
    .send({
      nome: 'Alberto Signup',
      genero: 'NS',
      descricao: 'asd',
      email: `${Date.now()}@test.mail`,
      password: 'user12345',
      n_telemovel: Date.now(),
      saldo: 40,
      estado_conta: 'A',
    })
    .then((res) => {
      expect(res.status).toBe(201);
      expect(res.body.nome).toBe('Alberto Signup');
      expect(res.body).toHaveProperty('genero');
      expect(res.body).toHaveProperty('descricao');
      expect(res.body).toHaveProperty('email');
      expect(res.body).toHaveProperty('n_telemovel');
      expect(res.body).toHaveProperty('saldo');
    });
});

test('Test #6 - Tentativa de criação de utilizador com campos obrigatórios em falta', () => {
  return request(app).post('/auth/signup')
    .send({
      nome: 'Alberto Signup',
      genero: 'NS',
      descricao: 'asd',
      email: `${Date.now()}@test.mail`,
      password: 'user12345',
      saldo: 40,
      estado_conta: 'A',
    })
    .then((res) => {
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('O número de telemóvel é um campo obrigatorio');
    });
});
