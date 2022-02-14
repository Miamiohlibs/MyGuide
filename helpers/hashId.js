const sha256 = require('sha256');

module.exports = HashId = (id) => {
  return sha256(id);
};
