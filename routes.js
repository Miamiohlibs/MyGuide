const config = require('config');
const getUserLoginInfo = require('./services/getUserInfo');
const CircController = require('./controllers/CirculationController');
const circController = new CircController();
const fs = require('fs');
module.exports = function (app) {
  app.get('/', async (req, res) => {
    let user = getUserLoginInfo(req);
    let circData = await circController.getUserData(user.person.userId);
    // res.send(userInfo);
    // res.render('dashboard', { user: userInfo, settings: settings });
    res.render('index', {
      user: user,
      circ: circData,
      fs: fs,
      config: config.get('viewConfigs'),
    });
  });

  app.get('/json', async (req, res) => {
    let userInfo = getUserLoginInfo(req);
    let circData = await circController.getUserData(userInfo.person.userId);
    res.send({ circ: circData, user: userInfo });
  });
};
