const Repository = require('../database/repository');
const { NotFound } = require('../handler/exceptionHandler');

const getUserById = (id) =>
  Repository.getUserById(id)
  .then(data => {
    if (data[0]) return data[0];
    throw new NotFound("Usuário não encontrado");
  });

const updateEntries = (id) => Repository.updateUserEntry(id);

module.exports = { updateEntries, getUserById };