const config = require('config');
// const getUserLoginInfo = require('./services/getUserInfo');
const UserDataController = require('./controllers/UserDataController');

const CircController = require('./controllers/CirculationController');
const circController = new CircController();
const fs = require('fs');
const logUsage = require('./models/usageLog/logUser');

module.exports = function (app) {
  app.get('/', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = userDataController.getUserData();
    let circData = await circController.getUserData(user.person.userId);
    // res.send(userInfo);
    // res.render('dashboard', { user: userInfo, settings: settings });
    res.render('index', {
      user: user,
      circ: circData,
      fs: fs,
      config: config.get('viewConfigs'),
    });
    logUsage(user);
  });

  app.get('/json', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = userDataController.getUserData();
    let circData = await circController.getUserData(user.person.userId);
    res.send({ circ: circData, user: user });
  });
};
