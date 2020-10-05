const { encrypt, compareHash } = require('../encryptor/encryptor');
const { BadRequest } = require('../handler/exceptionHandler');
const UserService = require('../services/userService');
const database = require('../database/database.json');
const { getUserById } = require('../services/userService');
const Repository = require('../database/repository');

const getLogins = () => database.logins;

const authenticate = (email, password) => {
  Repository.getLoginByEmail(email).then(data => {
    if (compareHash(password, data.hash)) {
      return Repository.getUserByEmail()
    }
  });

  const user = UserService.getUserBy({ email });


  throw new BadRequest("Usuário ou senha incorretos");
}

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