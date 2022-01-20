const CryptoJS = require('crypto-js');
const ValidationError = require('../errors/validationError');

module.exports = (app) => {
  const findChatMessages = async (id_viagem, id_chat) => {
    id_chat = encodeURIComponent(id_chat);

    const result = await app.db('chat')
      .where({ id_viagem })
      .where({ id_chat })
      .join('utilizadores', 'utilizadores.id_utilizador', 'chat.id_utilizador')
      .select(['chat.data', 'chat.id_viagem', 'chat.id_viagem', 'chat.mensagem', 'chat.id_utilizador', 'utilizadores.nome'])
      .where('leftRide', 'N');

    result.forEach((element) => {
      const bytes = CryptoJS.AES.decrypt(element.mensagem, 'd&2c4FwzqRtC@d');
      element.mensagem = bytes.toString(CryptoJS.enc.Utf8);
    });

    return result;
  };

  const create = (chat = {}) => {
    if (!chat.id_chat) throw new ValidationError('O ID de chat é um campo obrigatório');
    if (!chat.id_utilizador) throw new ValidationError('O ID de utilizador é um campo obrigatório');
    if (!chat.id_viagem) throw new ValidationError('O ID da viagem é um campo obrigatório');
    if (!chat.mensagem) throw new ValidationError('A mensagem é um campo obrigatório');

    chat.mensagem = CryptoJS.AES.encrypt(chat.mensagem, 'd&2c4FwzqRtC@d').toString();
    chat.data = Date.now();
    chat.leftRide = 'N';

    return app.db('chat').insert(chat, ['data', 'id_chat', 'id_viagem', 'id_utilizador', 'mensagem', 'leftRide']);
  };

  const getChatID = async (filter = {}) => {
    return await app.db('viagens').where(filter).select('id_chat');
  };

  return { findChatMessages, create, getChatID };
};
