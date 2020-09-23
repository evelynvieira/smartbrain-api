const { encrypt, compareHash } = require('../encryptor/encryptor');
const { BadRequest } = require('../handler/exceptionHandler');
const UserService = require('../services/userService');
const database = require('../database/database.json');
const { getUserBy } = require('../services/userService');

const getLogins = () => database.logins;

const authenticate = (email, password) => {
  const login = getLogins().find(login => login.email === email);
  const user = UserService.getUserBy({ email });

  if (login && compareHash(password, login.hash)) return user;

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

const register = ({ name, email, password }) => {
  if (!getUserBy({ email })) {
    UserService.addUser({ name, email });
    addLogin({ email, password });

    return;
  }

  throw new BadRequest("Email já cadastrado");
}

module.exports = { register, authenticate }