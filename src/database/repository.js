const db = require('./dbconfig');

const getUserById = (id) => db.select('*').from('users').where({ id });

const getLoginByUsername = (username) => db.select('*').from('login').where({ username });

const updateUserEntry = (id) =>
  db('users')
    .where('id', '=', id)
    .returning('entries')
    .increment('entries', 1);

const register = (user, login) =>
  db.transaction(trx => {
      trx.insert(user).returning('id').into('users')
      .then(userId => trx.insert({ ...login, user_id: userId[0] }).returning('user_id').into('login'))
      .then(trx.commit)
      .catch(trx.rollback);
  })
  .then(id => getUserById(id[0]));

module.exports = { register, getLoginByUsername, getUserById, updateUserEntry };
