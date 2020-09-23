const { encrypt } = require('../encryptor/encryptor');
const { NotFound } = require('../handler/exceptionHandler');
const database = require('../database/database.json');

const getUsers = () => database.users;

const getUserBy = (prop) => {
  const [key, value] = Object.entries(prop)[0];
  return getUsers().find(user => user[key] === value)
}

const getLastUserId = () => getUsers()[getUsers().length -1].id;

const addUser = ({ name, email }) => {
  const user = {
    id: getLastUserId() + 1,
    name,
    email,
    entries: 0,
    joinedAt: new Date()
  };

  getUsers().push(user);
}

const removeUser = (user) => getUsers().pop(user);

const updateEntries = (id) => {
  const user = getUserBy({ id });

  removeUser(user);
  getUsers().push({ ...user, entries: user.entries + 1 });

  return user;
}

module.exports = { addUser, updateEntries, getUserBy };