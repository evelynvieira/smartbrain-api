const express = require('express');
const bodyParser = require('body-parser');
const UserService = require('./src/services/userService');
const AuthService = require('./src/services/authService');

const  app = express();
app.use(bodyParser.json())


app.get('/:id', (req, res) => {
  const { id } = req.params;

  const user = UserService.getUserBy({ id: Number(id) });

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

  AuthService.register({ name, email, password });

  res.json({ message: "Registrado com sucesso" })
});

app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  const user = AuthService.authenticate(email, password)

  if (!user) {
    res.status(400).json({ errorMessage: "Usuário ou senha incorretos" });
  } else {
    res.json(user);
  }
});

app.listen(3000);

module.exports = app;