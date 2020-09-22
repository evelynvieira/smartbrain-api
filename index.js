const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs')
const database = require('./src/database/database.json');

const  app = express();
app.use(bodyParser.json())

const getUsers = () => database.users;
const getLogins =() => database.logins;
const getLastUser = () => getUsers()[getUsers().length - 1];
const addUser = (user) => getUsers().push(user);
const removeUser = (user) => getUsers().pop(user);
const addLogin = (login) => {
  const { email, password } = login;

  bcrypt.hash(password, null, null, function (err, hash) {
    if (err) {
      res.send(400).json({ message: err.message })
    }

    getLogins().push({
      email,
      hash,
      lastUpdate: new Date()
    });
  });
}

app.get('/:id', (req, res) => {
  const { id } = req.params;
  const user = getUsers().find(user => user.id === Number(id))

  if (!user) res.status(404).json({ errorMessage: "Usuário não encontrado" });

  res.json(user);
});

app.put('/:id', (req, res) => {
  const { id } = req.params;
  const user = getUsers().find(user => user.id === Number(id));

  if (!user) {
    res.status(404).json({ errorMessage: "Usuário não encontrado" });
  } else {
    removeUser(user);
    addUser({ ...user, entries: user.entries + 1 })

    res.send({ message: 'Usuário atualizado' })
  }

})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body;

  addUser({
    id: getLastUser().id + 1,
    name,
    email,
    entries: 0,
    joinedAt: new Date()
  });

  addLogin({ email, password, id: getLastUser().id })

  res.json({ message: "Registrado com sucesso" })
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const login = getLogins().find(login => login.email === email);


  if (login) {
    bcrypt.compare(password, login.hash, function (err, result) {

      if (result) {
        const { name, entries, joinedAt } = getUsers().find(user => user.email === email);
        res.json({ name, entries, joinedAt });
      } else {
        res.status(400).json({ errorMessage: "Usuário ou senha incorretos" });
      }
    })
  } else {
    res.status(400).json({ errorMessage: "Usuário ou senha incorretos" });
  }
});

app.listen(3000);

module.exports = app;