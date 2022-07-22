const config = require('config');
const UserDataController = require('../controllers/UserDataController');
const CircController = require('../controllers/CirculationController');
const circController = new CircController();
const fs = require('fs');
const logUsage = require('../models/usageLog/logUser');

const router = require('express').Router();

router.get('/', async (req, res) => {
  const userDataController = new UserDataController(req);
  const user = await userDataController.getUserData();
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

router.get('/json', async (req, res) => {
  const userDataController = new UserDataController(req);
  let user = await userDataController.getUserData();
  let circData = await circController.getUserData(user.person.userId);
  res.send({ circ: circData, user: user });
});

router.get('/test', (req, res) => {
  res.render('test');
});
module.exports = router;
