const config = require('config');
const getUserLoginInfo = require('./services/getUserInfo');
const fs = require('fs');
module.exports = function (app) {
  app.get('/', async (req, res) => {
    let user = getUserLoginInfo(req);
    // res.send(userInfo);
    // res.render('dashboard', { user: userInfo, settings: settings });
    res.render('index', {
      user: user,
      fs: fs,
      config: config.get('viewConfigs'),
    });
  });

  app.get('/json', async (req, res) => {
    let userInfo = getUserLoginInfo(req);
    res.send(userInfo);
  });
};
