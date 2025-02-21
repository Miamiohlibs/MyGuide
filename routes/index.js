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

IndexRouterError = (res) => {
  res.render('error', {
    myGuideVersion: version,
    fs: fs,
    gaTrackingId: config.get('viewConfigs.googleAnalyticsTrackingId'),
    config: config.get('viewConfigs'),
    error: {
      status: '500',
      statusText: 'Internal Server Error',
      message: `Unable to display page.`,
      more_information: `Error in index router. Please contact the system administrator.`,
    },
  });
};

router.get('/', async (req, res) => {
  try {
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
  } catch (err) {
    IndexRouterError(res);
  }
});

router.get('/json', async (req, res) => {
  try {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    let circData = await circController.getUserData(user.person.userId);
    res.send({ myGuideVersion: version, circ: circData, user: user });
  } catch (err) {
    res.status(500).send({ message: 'Error in index router', user, circData });
  }
});

router.get('/test', async (req, res) => {
  const userDataController = new UserDataController(req);
  let casResponse = await userDataController.rawUserData;
  res.json(casResponse);
});

router.get('/errorTest', async (req, res) => {
  try {
    throw new Error({ message: 'Test error' });
  } catch (err) {
    // console.error(JSON.stringify(err));
    IndexRouterError(res);
  }
});
module.exports = router;
