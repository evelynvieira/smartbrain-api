const express = require('express');
const bodyParser = require('body-parser');
const UserService = require('./src/services/userService');
const AuthService = require('./src/services/authService');
const { NotFound } = require('./src/handler/exceptionHandler');

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
  try {
    const { name, email, password } = req.body;
    AuthService.register({ name, email, password });

    res.json({ message: "Registrado com sucesso" })
  } catch (e) {
    res.status(400).json({ errorMessage: e.message });
  }
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