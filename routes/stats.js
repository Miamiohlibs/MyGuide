const fs = require('fs');
const getUsageData = require('../helpers/getUsageData');
const getFavStats = require('../helpers/getFavoritesStats');
const UserDataController = require('../controllers/UserDataController');
const router = require('express').Router();
const pjson = require('../package.json');
const version = pjson.version;
const config = require('config');

// Authorization middleware for stats routes
let allowedUsers = [];
if (config.has('allowedStatsUsersCommaSeparated')) {
  allowedUsers = config.get('allowedStatsUsersCommaSeparated').split(',');
}

router.use(async (req, res, next) => {
  const userDataController = new UserDataController(req);
  const user = await userDataController.getUserData();
  if (allowedUsers.includes(user.person.userId)) {
    next();
  } else {
    res.status(403).render('error', {
      myGuideVersion: version,
      fs: fs,
      gaTrackingId: config.get('viewConfigs.googleAnalyticsTrackingId'),
      config: config.get('viewConfigs'),
      error: {
        status: '403',
        statusText: 'Forbidden',
        message: `User "${user.person.userId}" is not authorized to view this page.`,
        more_information:
          'The permitted users are defined in the configuration file. Please contact the system administrator if you believe you should have access to this page.',
      },
    });
  }
});

/* Graphing Routes */

router.get('/', (req, res) => {
  res.redirect('/stats/usage');
});
router.get('/usage', (req, res) => {
  res.render('stats-graphUsage', { page: 'usage', myGuideVersion: version });
});
router.get('/favorites', (req, res) => {
  res.render('stats-graphFavorites', {
    page: 'favorites',
    myGuideVersion: version,
  });
});

router.get('/repeatUsers', (req, res) => {
  // res.send('Test');
  res.render('stats-graphRepeats', {
    page: 'repeatUsers',
    myGuideVersion: version,
  });
});
router.get('/subjects', (req, res) => {
  res.render('stats-graphSubjects', {
    page: 'subjects',
    myGuideVersion: version,
  });
});

/* JSON stats routes */

router.get('/usageData', (req, res) => {
  // set default params
  let increment = req.query.increment || 'month';
  if (!req.query.startDate) {
    req.query.startDate = '2021-09-02';
  }

  // get data
  data = getUsageData();
  let usageReport = require('../helpers/reportUsage');
  let stats = usageReport(data, increment, req.query);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(stats));
});

router.get('/repeatData', async (req, res) => {
  data = getUsageData();
  let repeatUsers = require('../helpers/getRepeatUsers');
  let repeatData = repeatUsers(data, req.query);
  res.setHeader('Content-Type', 'application/json');
  res.end(
    JSON.stringify({
      repeatData,
    })
  );
});

router.get('/subjectData', (req, res) => {
  data = getUsageData();
  let getSubjectStats = require('../helpers/getSubjectStats');
  let stats = getSubjectStats(data, req.query);
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ stats }));
});

router.get('/favoritesData', async (req, res) => {
  data = await getFavStats();
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
});

module.exports = router;
