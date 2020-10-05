const { encrypt } = require('../encryptor/encryptor');
const { NotFound } = require('../handler/exceptionHandler');
const database = require('../database/database.json');
const Repository = require('../database/repository');

const getUsers = () => database.users;

const getUserById = (id) =>
  Repository.getUserById(id)
  .then(data => {
    if (data[0]) return data[0];
    throw new NotFound("Usuário não encontrado");
  });

const removeUser = (user) => getUsers().pop(user);

const updateEntries = (id) => {
  const user = getUserBy({ id });

  removeUser(user);
  getUsers().push({ ...user, entries: user.entries + 1 });

  return user;
}

module.exports = { updateEntries, getUserById };