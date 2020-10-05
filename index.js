const express = require('express');
const bodyParser = require('body-parser');
const UserService = require('./src/services/userService');
const AuthService = require('./src/services/authService');

const  app = express();
app.use(bodyParser.json())


app.get('/:id', (req, res) => {
  const { id } = req.params;
  UserService.getUserById(Number(id))
  .then(user => res.json(user))
  .catch(error => res.status(404).json({ errorMessage: error.message }))
});

app.put('/:id', (req, res) => {
    const { id } = req.params;

    UserService.updateEntries(Number(id))
    .then(data => res.send({
      data: {
        entries: data[0].entries,
        updated_at: data[0].updated_at
      },
      message: 'Usuário atualizado'
    }))
    .catch(error => res.status(400).json({ errorMessage: error.message }));
})

app.post('/register', (req, res) => {
    const { name, username, password } = req.body;

    AuthService.register({ name, username, password })
    .then(data => res.json({ data: data[0], message: "Registrado com sucesso" }))
    .catch(error =>
      res.status(400).json({ errorMessage: "Não foi possível registrar", detail: error }));

});

app.post('/signin', (req, res) => {
  const { username, password } = req.body;

  AuthService.authenticate(username, password)
  .then(user => res.json(user))
  .catch(error => res.status(400).json({ errorMessage: error.message }))
});

app.listen(3000);

module.exports = app;