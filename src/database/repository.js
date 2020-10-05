const db = require('./dbconfig');

const getUserById = (id) => db.select('*').from('users').where({ id });
const getLoginByEmail = (email) => db.select('login').where({ email });
const updateUser = (user) =>
  db.update('users')
    .where('id', user.id)
    .increment('entries', 1)
    .returning('*');
const register = (user, login) =>
  db.transaction(trx => {
      trx.insert(user).returning('id').into('users')
      .then(userId => trx.insert({ ...login, user_id: userId[0] }).returning('user_id').into('login'))
      .then(trx.commit)
      .catch(trx.rollback);
  })
  .then(id => getUserById(id[0]));

module.exports = { register, getLoginByEmail, getUserById };
