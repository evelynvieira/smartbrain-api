const { encrypt, compareHash } = require('../encryptor/encryptor');
const { BadRequest } = require('../handler/exceptionHandler');
const UserService = require('../services/userService');
const database = require('../database/database.json');
// const { getLoginByUsername } = require('../services/userService');
const Repository = require('../database/repository');

const getLogins = () => database.logins;

const authenticate = (username, password) =>
  Repository.getLoginByUsername(username).then(data => {
    const login = data[0];

    if (login && compareHash(password, login.hash)) {
      return Repository.getUserById(login.user_id);
    } else {
      throw new BadRequest("Usuário ou senha incorretos");
    }
  });

const addLogin = ({ email, password }) => {
  const login = {
    email,
    hash: encrypt(password),
    lastUpdate: new Date()
   };

   getLogins().push(login);
}

const register = ({ name, username, password }) => {
  const hash = encrypt(password);
  const user = { name, username, joined_at: new Date() };
  const login = { username, hash }

  return Repository.register(user, login);
}

module.exports = { register, authenticate }