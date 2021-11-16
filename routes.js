const config = require('config');
const getUserLoginInfo = require('./services/getUserInfo');

module.exports = function (app) {
  app.get('/', async (req, res) => {
    let userInfo = getUserInfo(req);
    res.send(userInfo);
  });
};
