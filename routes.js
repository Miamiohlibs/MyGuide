const config = require('config');
const getUserLoginInfo = require('./services/getUserInfo');

module.exports = function (app) {
  app.get('/', async (req, res) => {
    let userInfo = getUserLoginInfo(req);
    res.send(userInfo);
  });

  app.get('/json', async (req, res) => {
    let userInfo = getUserLoginInfo(req);
    res.send(userInfo);
  });
};
