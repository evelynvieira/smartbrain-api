const express = require('express');
const bodyParser = require('body-parser');
const knex = require('knex');
const UserService = require('./src/services/userService');
const AuthService = require('./src/services/authService');
const { NotFound } = require('./src/handler/exceptionHandler');
const e = require('express');

knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    database: 'smartbrain'
  }
 });

const  app = express();
app.use(bodyParser.json())


app.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = UserService.getUserBy({ id: Number(id) });

    if (!user) throw new NotFound("Usuário não encontrado");

    res.json(user);

  } catch (e) {
    res.status(404).json({ errorMessage: e.message });
  }
});

app.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    UserService.updateEntries(Number(id));
    res.send({ message: 'Usuário atualizado' })
  } catch (e) {
    res.status(400).json({ errorMessage: e.message });
  }
})

app.post('/register', (req, res) => {
    const { name, username, password } = req.body;

    AuthService.register({ name, username, password })
    .then(data => res.json({ data: data[0], message: "Registrado com sucesso" }))
    .catch(error =>
      res.status(400).json({ errorMessage: "Não foi possível registrar", detail: error }));

});

app.post('/signin', (req, res) => {
  try {
    const { email, password } = req.body;
    const user = AuthService.authenticate(email, password)
    res.json(user);
  } catch (e) {
    res.status(400).json({ errorMessage: e.message });
  }
});

app.listen(3000);

module.exports = app;