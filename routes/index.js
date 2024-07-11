const config = require('config');
const UserDataController = require('../controllers/UserDataController');
const CircController = require('../controllers/CirculationController');
const circController = new CircController();
const fs = require('fs');
const logUsage = require('../models/usageLog/logUser');
const logUrl = require('../models/usageLog/logUrl');
const pjson = require('../package.json');
const version = pjson.version;
const logger = require('../helpers/Logger');

const router = require('express').Router();

router.get('/', async (req, res) => {
  try{   
  logger.debug(req.session.cas);
  const userDataController = new UserDataController(req);
  const user = await userDataController.getUserData();
  let circData = await circController.getUserData(user.person.userId);
} catch (err) {
  // res.send(userInfo);
  // res.render('dashboard', { user: userInfo, settings: settings });
    let data = JSON.stringify(req.session.cas);
    logger.debug('index router failed to get user data');
    logger.debug(err);
    res.send('Unable to load MyGuide');
    res.end();
//    res.render('error', {message: '<h1>MyGuide is down. We are working to fix the issue as soon as possible.</h1><h2>');
}

try {
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
//    res.render('error', {message: '<h1>MyGuide is down. We are working to fix the issue as soon as possible.</h1><h2>'} );
    res.send('Unable to load MyGuide');
    res.end();
}
});

router.get('/json', async (req, res) => {
  const casData = req.session.cas;
  const userDataController = new UserDataController(req);
  let user = await userDataController.getUserData();
  let circData = await circController.getUserData(user.person.userId);
  res.send({ myGuideVersion: version, cas: casData, circ: circData, user: user, isThisThingOn: true });
});

router.get('/test', (req, res) => {
  res.render('test');
});
module.exports = router;
