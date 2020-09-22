const { encrypt } = require('../encryptor/encryptor');
const database = require('../database/database.json');

const getUsers = () => database.users;

const getLogin = () => database.logins;

const getById = (id) => getUsers().find(user => user.id === id);

const getLastUserId = () => getUsers()[getUsers().length -1].id;

const addLogin = ({ password, email }) => {
  const login = {
    email,
    hash: encrypt(password),
    lastUpdate: new Date()
   };

   getLogin().push(login);
}

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

const register = (user) => {
  addUser(user);
  addLogin(user);
}

const removeUser = (user) => getUsers().pop(user);

const updateEntries = (id) => {
  const user = getById(id);
  if (user) {
    removeUser(user);
    getUsers().push({ ...user, entries: user.entries + 1 });
  }

  return user;
}

module.exports = { register, updateEntries, getById };