const fs = require('fs');
const getUsageData = require('../helpers/getUsageData');
const router = require('express').Router();
const pjson = require('../package.json');
const version = pjson.version;
const logger = require('../helpers/Logger');

/* Graphing Routes */

router.get('/', (req, res) => {
  logger.debug('re-routing to stats/usage');
  res.redirect('/stats/usage');
});
router.get('/usage', (req, res) => {
  res.render('stats-graphUsage', { page: 'usage', myGuideVersion: version });
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
    page: 'subjectGraph',
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

module.exports = router;
