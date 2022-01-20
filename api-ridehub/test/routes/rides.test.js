const request = require('supertest');
const jwt = require('jwt-simple');
const CryptoJS = require('crypto-js');
const app = require('../../src/app');
const config = require('../../config');

const secret = config.authToken;
const ROUTE = '/v1/ride';
let user;
let vehicle;
let generateURL = CryptoJS.AES.encrypt(Date.now().toString(), config.chatURL).toString();
generateURL = encodeURIComponent(generateURL);

const matricula = `${Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString()
}-` + 'AZ'
  + `-${Math.floor(Math.random() * 9).toString()}${Math.floor(Math.random() * 9).toString()}`;

beforeAll(async () => {
  const createUser = await app.services.user.create({
    nome: 'alberto',
    genero: 'M',
    descricao: 'descriptiontest RIDES',
    email: `${Date.now()}@test.mail`,
    password: 'user12345',
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
});

describe('Test #1 - Listar viagens', () => {
  test('Test #1.1 - Listar todas as viagens', () => {
    return request(app).get(ROUTE)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(0);
      });
  });

  test('Test #1.2 - Listar uma viagem por ID', () => {
    return app.db('viagens').insert({
      data: Date.now(),
      origem: 'Porto',
      destino: 'Braga',
      custo: 30,
      lugares_disponiveis: 5,
      descricao: 'Carrinha MUITO GRANDE da FEIRA',
      estado: 'W',
      id_utilizador: user.id_utilizador,
      id_viatura: vehicle.id_viatura,
      geo_origem: '-8.3864703,41.551471',
      geo_destino: '-8.3864703,41.5514713',
      id_chat: generateURL,
    }, ['id_viagem'])
      .then((result) => request(app).get(`${ROUTE}/${result[0].id_viagem}`)
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.id_viagem).toBe(result[0].id_viagem);
        }));
  });

  test('Test #1.3 - Listar uma viagem por ID de autor', () => {
    return request(app).get(`${ROUTE}/author/${user.id_utilizador}`)
      .set('authorization', `bearer ${user.token}`)
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  test('Test #1.4 - Listar os ocupantes por ID de viagem', () => {
    return app.db('viagens').insert({
      data: Date.now(),
      origem: 'Porto',
      destino: 'Braga',
      custo: 30,
      lugares_disponiveis: 5,
      descricao: 'Carrinha MUITO GRANDE da FEIRA',
      estado: 'W',
      id_utilizador: user.id_utilizador,
      id_viatura: vehicle.id_viatura,
      geo_origem: '-8.3864703,41.551471',
      geo_destino: '-8.3864703,41.5514713',
      id_chat: generateURL,
    }, ['id_viagem'])
      .then((result) => request(app).get(`${ROUTE}/occupants/${result[0].id_viagem}`)
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.id_viagem).toBe(result.id_viagem);
        }));
  });

  test('Test #1.4 - Listar qnt de ocupantes por ID de viagem', () => {
    return app.db('viagens').insert({
      data: Date.now(),
      origem: 'Porto',
      destino: 'Braga',
      custo: 30,
      lugares_disponiveis: 5,
      descricao: 'Carrinha MUITO GRANDE da FEIRA',
      estado: 'W',
      id_utilizador: user.id_utilizador,
      id_viatura: vehicle.id_viatura,
      geo_origem: '-8.3864703,41.551471',
      geo_destino: '-8.3864703,41.5514713',
      id_chat: generateURL,
    }, ['id_viagem'])
      .then((result) => request(app).get(`${ROUTE}/ammount/${result[0].id_viagem}`)
        .set('authorization', `bearer ${user.token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.body.id_viagem).toBe(result.id_viagem);
        }));
  });
});

test('Test #2 - Inserir uma viagem', () => {
  return request(app).post(ROUTE)
    .set('authorization', `bearer ${user.token}`)
    .send({
      data: Date.now(),
      origem: 'Porto',
      destino: 'Braga',
      custo: 30,
      lugares_disponiveis: 5,
      descricao: 'Carrinha MUITO MUITO GRANDE da FEIRA',
      estado: 'W',
      id_utilizador: user.id_utilizador,
      id_viatura: vehicle.id_viatura,
      geo_origem: '-8.3864703,41.551471',
      geo_destino: '-8.3864703,41.5514713',
      id_chat: generateURL,
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
        data: Date.now(),
        origem: 'Porto',
        destino: 'Braga',
        custo: 30,
        lugares_disponiveis: 5,
        descricao: 'Carrinha MUITO MUITO GRANDE da FEIRA',
        estado: 'W',
        id_utilizador: user.id_utilizador,
        id_viatura: vehicle.id_viatura,
        geo_origem: '-8.3864703,41.551471',
        geo_destino: '-8.3864703,41.5514713',
        id_chat: generateURL,
        ...data,
      })
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.body.error).toBe(errorMessage);
      });
  };

  test('Test #3.1 - Inserir viagem sem data', () => testTemplate({ data: null }, 'A data é um campo obrigatorio'));

  test('Test #3.2 - Inserir viagem sem origem', () => testTemplate({ origem: null }, 'A origem é um campo obrigatorio'));

  test('Test #3.3 - Inserir viagem sem destino', () => testTemplate({ destino: null }, 'O destino é um campo obrigatorio'));

  test('Test #3.4 - Inserir viagem sem custo', () => testTemplate({ custo: null }, 'O custo é um campo obrigatorio'));

  test('Test #3.5 - Inserir viagem sem lugares ocupados', () => testTemplate({ lugares_disponiveis: null }, 'Os lugares disponiveis é um campo obrigatorio'));

  test('Test #3.6 - Inserir viagem sem descricao', () => testTemplate({ descricao: null }, 'A descricao é um campo obrigatorio'));

  test('Test #3.7 - Inserir viagem sem estado', () => testTemplate({ estado: null }, 'O estado é um campo obrigatorio'));

  test('Test #3.8 - Inserir viagem sem o ID de utilizador', () => testTemplate({ id_utilizador: null }, 'O ID do utilizador é um campo obrigatorio'));

  test('Test #3.9 - Inserir viagem sem ID viatura', () => testTemplate({ id_viatura: null }, 'O ID da viatura é um campo obrigatorio'));

  test('Test #3.10 - Inserir viagem sem geo origem', () => testTemplate({ geo_origem: null }, 'As coordenadas de origem são um campo obrigatorio'));

  test('Test #3.11 - Inserir viagem sem geo destino', () => testTemplate({ geo_destino: null }, 'As coordenadas do destino são um campo obrigatorio'));
});

test('Test #4 - Remover uma viagem', () => {
  return app.db('viagens').insert({
    data: Date.now(),
    origem: 'Lisboa',
    destino: 'Braga',
    custo: 30,
    lugares_disponiveis: 5,
    descricao: 'Carrinha MUITO MUITO GRANDE da FEIRA',
    estado: 'W',
    id_utilizador: user.id_utilizador,
    id_viatura: vehicle.id_viatura,
    geo_origem: '-8.3864703,41.551471',
    geo_destino: '-8.3864703,41.5514713',
    id_chat: generateURL,
  }, ['id_viagem']).then((result) => request(app).delete(`${ROUTE}/${result[0].id_viagem}`)
    .set('authorization', `bearer ${user.token}`)
    .then((res) => {
      expect(res.status).toBe(204);
    }));
});

test('Test #5 - Atualizar viagem', () => {
  return app.db('viagens').insert({
    data: Date.now(),
    origem: 'Porto',
    destino: 'Braga',
    custo: 30,
    lugares_disponiveis: 5,
    descricao: 'Carrinha MUITO MUITO GRANDE da FEIRA',
    estado: 'W',
    id_utilizador: user.id_utilizador,
    id_viatura: vehicle.id_viatura,
    geo_origem: '-8.3864703,41.551471',
    geo_destino: '-8.3864703,41.5514713',
    id_chat: generateURL,
  }, ['id_viagem'])
    .then((result) => request(app).put(`${ROUTE}/${result[0].id_viagem}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ origem: 'Madrid' })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.origem).toBe('Madrid');
      }));
});

test('Test #6 - Atualizar estado da viagem', () => {
  return app.db('viagens').insert({
    data: Date.now(),
    origem: 'Porto',
    destino: 'Braga',
    custo: 30,
    lugares_disponiveis: 5,
    descricao: 'Carrinha MUITO MUITO GRANDE da FEIRA',
    estado: 'O',
    id_utilizador: user.id_utilizador,
    id_viatura: vehicle.id_viatura,
    geo_origem: '-8.3864703,41.551471',
    geo_destino: '-8.3864703,41.5514713',
    id_chat: generateURL,
  }, ['id_viagem'])
    .then((result) => request(app).put(`${ROUTE}/${result[0].id_viagem}`)
      .set('authorization', `bearer ${user.token}`)
      .send({ estado: 'W' })
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body.estado).toBe('W');
      }));
});

// router.get('/ammount/:id', (req, res, next) => {
//   app.services.ride.findAmmount({ id_viagem: req.params.id })
//     .then((result) => res.status(200).json(result[0]))
//     .catch((err) => next(err));
// });
