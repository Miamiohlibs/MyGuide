const config = require('config');
const UserDataController = require('../controllers/UserDataController');
const CircController = require('../controllers/CirculationController');
const circController = new CircController();
const fs = require('fs');
const logUsage = require('../models/usageLog/logUser');
const logUrl = require('../models/usageLog/logUrl');
const pjson = require('../package.json');
const version = pjson.version;

const router = require('express').Router();

router.get('/', async (req, res) => {
  const userDataController = new UserDataController(req);
  const user = await userDataController.getUserData();
  let circData = await circController.getUserData(user.person.userId);
  // res.send(userInfo);
  // res.render('dashboard', { user: userInfo, settings: settings });
  res.render('index', {
    myGuideVersion: version,
    user: user,
    circ: circData,
    fs: fs,
    config: config.get('viewConfigs'),
  });
  logUsage(user);
  logUrl(req);
});

router.get('/json', async (req, res) => {
  const userDataController = new UserDataController(req);
  let user = await userDataController.getUserData();
  let circData = await circController.getUserData(user.person.userId);
  res.send({ myGuideVersion: version, circ: circData, user: user });
});

router.get('/test', async (req, res) => {
    const userDataController = new UserDataController(req);
    let casResponse = await userDataController.rawUserData;
    res.json(casResponse);
});
module.exports = router;
