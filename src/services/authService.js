const { encrypt, compareHash } = require('../encryptor/encryptor');
const UserService = require('../services/userService');
const database = require('../database/database.json');

const getLogins = () => database.logins;

const authenticate = (email, password) => {
  const login = getLogins().find(login => login.email === email);
  const user = UserService.getUserBy({ email });

  if (login && compareHash(password, login.hash)) {
    return user
  }

  return null;
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
  UserService.addUser({ name, email });
  addLogin({ email, password })
}

module.exports = { register, authenticate }