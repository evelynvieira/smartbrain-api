const express = require('express');
const bodyParser = require('body-parser');
const database = require('./src/database/database.json');
const UserService = require('./src/services/userService');
const { compareHash } = require('./src/encryptor/encryptor');

const  app = express();
app.use(bodyParser.json())

const getUsers = () => database.users;
const getLogins =() => database.logins;

app.get('/:id', (req, res) => {
  const { id } = req.params;

  const user = UserService.getById(Number(id));

  if (!user) res.status(404).json({ errorMessage: "Usuário não encontrado" });

  res.json(user);
});

app.put('/:id', (req, res) => {
  const { id } = req.params;
  const user = UserService.updateEntries(Number(id))

  if (!user) {
    res.status(404).json({ errorMessage: "Usuário não encontrado" });
  } else {
    res.send({ message: 'Usuário atualizado' })
  }

})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  UserService.register({ name, email, password });

  res.json({ message: "Registrado com sucesso" })
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const login = getLogins().find(login => login.email === email);

  if (login) {
    if (compareHash(password, login.hash)) {
      const { name, entries, joinedAt } = getUsers().find(user => user.email === email);
      res.json({ name, entries, joinedAt });
    } else {
      res.status(400).json({ errorMessage: "Usuário ou senha incorretos" });
    }
  } else {
    res.status(400).json({ errorMessage: "Usuário ou senha incorretos" });
  }
});

app.listen(3000);

module.exports = app;