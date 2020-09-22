const express = require('express');
const bodyParser = require('body-parser');
const database = require('./src/database/database.json');

const  app = express();
app.use(bodyParser.json())

const getUsers = () => database;
const addUser = (user) => getUsers().push(user);
const removeUser = (user) => getUsers().pop(user);

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
  const { name, email } = req.body;
  const { id } = getUsers()[getUsers().length - 1];

  addUser({
    id: id + 1,
    name,
    email,
    entries: 0,
    joinedAt: new Date()
  });

  res.json(getUsers()[getUsers().length - 1])
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;

  const user = getUsers().find(user => user.email === email);

  if (!user) res.status(400).json({ errorMessage: "Usuário ou senha incorretos" });

  res.json({ name: user.name, entries: user.entries, joinedAt: user.joinedAt });
});

app.listen(3000);

module.exports = app;