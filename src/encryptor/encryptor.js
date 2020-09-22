const bcrypt = require('bcrypt-nodejs');

const encrypt = (data) => bcrypt.hashSync(data, null);

const compareHash = (data, hash) => bcrypt.compareSync(data, hash)

module.exports = { encrypt, compareHash };
