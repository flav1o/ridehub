/* eslint-disable no-use-before-define */
const bcrypt = require('bcrypt-nodejs');
const ValidationError = require('../errors/validationError');

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports = (app) => {
  const findOne = async (filter = {}) => {
    const result = await app.db('utilizadores').where(filter).first();
    if(result.estado_conta === 'D') return;
    
    return result;
  };

  const getPasswordHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
  };

  const create = async (user) => {
    if (!user.nome) throw new ValidationError('O nome é um campo obrigatorio');
    if (!user.genero) throw new ValidationError('O genero é um campo obrigatorio');
    if (!user.email) throw new ValidationError('O email é um campo obrigatorio');
    if (!user.descricao) throw new ValidationError('A descrição é um campo obrigatorio');
    if (!user.email) throw new ValidationError('O email é um campo obrigatorio');
    if (!user.password) throw new ValidationError('A palavra-passe é um campo obrigatorio');
    if (!user.n_telemovel) throw new ValidationError('O número de telemóvel é um campo obrigatorio');
    if (!user.saldo) throw new ValidationError('O saldo é um campo obrigatorio');
    if (!user.estado_conta) throw new ValidationError('O estado da conta é um campo obrigatorio');
    if (!emailRegex.test(user.email)) throw new ValidationError('O email não segue os padrões convencionais!');
    if (!passwordRegex.test(user.password)) throw new ValidationError('A password não segue os padrões convencionais!');

    const userDBEmail = await findOne({ email: user.email });
    if (userDBEmail) throw new ValidationError('Email duplicado');

    const userDBNTelemovel = await findOne({ n_telemovel: user.n_telemovel });
    if (userDBNTelemovel) throw new ValidationError('Número telemóvel duplicado');

    const newUser = { ...user };
    newUser.password = getPasswordHash(user.password);

    return app.db('utilizadores').insert(newUser, ['id_utilizador', 'nome', 'genero', 'descricao', 'email', 'n_telemovel', 'saldo', 'estado_conta']);
  };

  const update = async (id_utilizador, user) => {
    if (user.password) { user.password = getPasswordHash(user.password); }

    const instagram = user.instagram;
    user.instagram = "";
    user.instagram = `https://www.instagram.com/${instagram}`;

    const twitter = user.twitter;
    user.twitter = "";
    user.twitter = `https://www.twitter.com/${twitter}`;

    const snapchat = user.snapchat;
    user.snapchat = "";
    user.snapchat = `@${snapchat}`;

    console.log(user)

    return app.db('utilizadores').where({ id_utilizador }).update(user, ['id_utilizador', 'nome', 'genero', 'descricao', 'email', 'password', 'n_telemovel', 'saldo', 'estado_conta', 'instagram', 'twitter', 'snapchat']);
  };

  const remove = async (id_utilizador) => {
    return app.db('utilizadores').where({ id_utilizador }).del();
  };

  const forgotPassword = async (filter) => {
    if (!filter.email) throw new ValidationError('O email é um campo obrigatório');
    if (!filter.n_telemovel) throw new ValidationError('O número telemóvel é um campo obrigatório');
    if (!filter.password) throw new ValidationError('A password é um campo obrigatório');
    if (!filter.confirmpassword) throw new ValidationError('A password é um campo obrigatório');
    if (filter.password !== filter.confirmpassword) throw new ValidationError('As password têm que coincidir');
    if (!emailRegex.test(filter.email)) throw new ValidationError('O email não segue os padrões convencionais!');
    if (!passwordRegex.test(filter.password)) throw new ValidationError('A password não segue os padrões convencionais!');
    filter.password = getPasswordHash(filter.password);

    const result = await app.db('utilizadores').where('email', filter.email).first();

    if (result.n_telemovel == filter.n_telemovel) {
      return app.db('utilizadores').where('n_telemovel', filter.n_telemovel).update('password', filter.password);
    }
    throw new ValidationError('Verifique os seus detalhes!');
  };

  const rideDriver = async (id_utilizador) => {
    return app.db('viagens')
      .join('ocupantes', 'ocupantes.id_viagem', 'viagens.id_viagem')
      .where({ 'viagens.estado': 'W' })
      .where({ 'viagens.id_utilizador': id_utilizador })
      .select(['viagens.id_viagem', 'viagens.origem', 'viagens.destino', 'viagens.descricao'])
      .count('ocupantes.id_viagem AS ocupantes')
      .groupBy('viagens.id_viagem');
  };

  const activeRides = async (id_utilizador) => {
    return app.db('ocupantes')
      .join('viagens', 'viagens.id_viagem', 'ocupantes.id_viagem')
      .where({ 'ocupantes.id_utilizador': id_utilizador })
      .where({ 'viagens.estado': 'W' })
      .select(['viagens.id_viagem', 'viagens.origem', 'viagens.destino', 'viagens.descricao']);
  };

  const userMoney = async (id_utilizador) => {
    return app.db('utilizadores').where(id_utilizador).select(['saldo']);
  };

  const updateUserMoney = async (id_utilizador, filter) => {
    let finalAmmount;

    if (!filter.quantia) throw new ValidationError('A quantia é um campo obrigatorio');
    if (!filter.operacao) throw new ValidationError('A operação é um campo obrigatorio');
    if (!(filter.operacao === 'O' || filter.operacao === 'I')) throw new ValidationError('A operação é um campo obrigatorio');

    const currentAmmount = await app.db('utilizadores').where({ id_utilizador }).select(['saldo']);

    if (filter.operacao === 'I') finalAmmount = +currentAmmount[0].saldo + +filter.quantia;
    if (filter.operacao === 'O') finalAmmount = +currentAmmount[0].saldo - +filter.quantia;

    if (finalAmmount < 0) throw new ValidationError('Não tem saldo suficiente!');

    return app.db('utilizadores')
      .where({ id_utilizador })
      .update('saldo', finalAmmount)
      .then(() => {
        return app.db('transacoes').insert({
          data: Date.now(), montante: +filter.quantia, tipo: filter.operacao, id_utilizador,
        });
      });
  };

  const deactivateAccount = async (id_utilizador) => {
    const nViagensAtivas = await app.db('viagens')
      .join('ocupantes', 'ocupantes.id_viagem', 'viagens.id_viagem')
      .where({ 'ocupantes.id_utilizador': id_utilizador })
      .where({ 'viagens.estado': 'W' });

    if (nViagensAtivas.length > 0) throw new ValidationError('Tem viagens em espera!');

    return app.db('utilizadores').where({ id_utilizador }).update('estado_conta', 'D');
  };

  const activeUsers = () => {
    return app.db('utilizadores').select(['id_utilizador', 'nome', 'genero', 'descricao', 'email', 'n_telemovel', 'saldo', 'estado_conta'])
      .orderBy('id_utilizador', 'desc')
      .limit(6);
  };

  const searchUserByName = (nome) => {
    return app.db('utilizadores').where('nome', 'like', `%${nome}%`).select(['id_utilizador', 'nome', 'genero', 'descricao', 'email', 'n_telemovel', 'saldo', 'estado_conta']);
  };

  return {
    findOne,
    create,
    update,
    remove,
    userMoney,
    updateUserMoney,
    deactivateAccount,
    forgotPassword,
    activeUsers,
    searchUserByName,
    rideDriver,
    activeRides
  };
};
