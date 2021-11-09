const config = require('config');
const getUserInfo = require('./services/getUserInfo');

module.exports = function (app) {
  app.get('/', async (req, res) => {
    let userInfo = getUserInfo(req);
    res.send(userInfo);
  });
};
