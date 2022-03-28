const config = require('config');
const UserDataController = require('./controllers/UserDataController');
const UserFavoritesController = require('./controllers/UserFavoritesController');
const CircController = require('./controllers/CirculationController');
const SubjectController = require('./controllers/SubjectController');
const circController = new CircController();
const fs = require('fs');
const logUsage = require('./models/usageLog/logUser');
const { response } = require('express');
const getUsageData = require('./helpers/getUsageData');
const getRepeatUsers = require('./helpers/getRepeatUsers');

module.exports = function (app) {
  app.get('/', async (req, res) => {
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

  app.get('/json', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    let circData = await circController.getUserData(user.person.userId);
    res.send({ circ: circData, user: user });
  });
  app.get('/favorites/subjects', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    let subjController = new SubjectController();
    let subjects = subjController.getSubjects();
    const userFavoritesController = new UserFavoritesController(userId);
    let favs = await userFavoritesController.getFavorites();
    res.render('favorite-subjects', {
      favorites: favs,
      subjects: subjects,
      config: config.get('viewConfigs'),
    });
  });
  app.post('/favorites/subjects/add', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    const userFavoritesController = new UserFavoritesController(userId);
    let favs = await userFavoritesController.updateFavoriteAdd(
      'subject',
      req.body.subjectToAdd
    );
    res.redirect('/favorites/subjects');
  });
  app.post('/favorites/subjects/remove', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    const userFavoritesController = new UserFavoritesController(userId);
    let favs = await userFavoritesController.updateFavoriteRemove(
      'subject',
      req.body.subjectToRemove
    );
    res.redirect('/favorites/subjects');
  });
  app.post('/favorites/databases/add', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    // console.log('adding favorite database ' + req.body.resourceId);
    const userFavoritesController = new UserFavoritesController(userId);
    let addResponse = await userFavoritesController.updateFavoriteAdd(
      'database',
      req.body.resourceId
    );
    if (addResponse.success) {
      res.writeHead(201);
      res.end();
    } else {
      res.writeHead(500);
      res.end();
    }
  });
  app.post('/favorites/databases/remove', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    // console.log('adding favorite database ' + req.body.resourceId);
    const userFavoritesController = new UserFavoritesController(userId);
    let removeResponse = await userFavoritesController.updateFavoriteRemove(
      'database',
      req.body.resourceId
    );
    if (removeResponse.success) {
      res.writeHead(202);
      res.end();
    } else {
      res.writeHead(500);
      res.end();
    }
  });
  app.post('/favorites/guides/add', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    // console.log('adding favorite guide ' + req.body.resourceId);
    const userFavoritesController = new UserFavoritesController(userId);
    let addResponse = await userFavoritesController.updateFavoriteAdd(
      'guide',
      req.body.resourceId
    );
    if (addResponse.success) {
      res.writeHead(201);
      res.end();
    } else {
      res.writeHead(500);
      res.end();
    }
  });
  app.post('/favorites/guides/remove', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    // console.log('adding favorite guide ' + req.body.resourceId);
    const userFavoritesController = new UserFavoritesController(userId);
    let removeResponse = await userFavoritesController.updateFavoriteRemove(
      'guide',
      req.body.resourceId
    );
    if (removeResponse.success) {
      res.writeHead(202);
      res.end();
    } else {
      res.writeHead(500);
      res.end();
    }
  });

  /* Graphing and stats Routes */

  app.get('/graph', (req, res) => {
    res.render('stats-graph');
  });

  app.get('/usageData', (req, res) => {
    // set default params
    let increment = req.query.increment || 'month';
    if (!req.query.startDate) {
      req.query.startDate = '2021-09-02';
    }

    // get data
    data = getUsageData();
    const usageReport = require('./helpers/reportUsage');
    let stats = usageReport(data, increment, req.query);
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(stats));
  });

  app.get('/repeatUsers', async (req, res) => {
    data = getUsageData();
    const repeatUsers = require('./helpers/getRepeatUsers');
    let allSummary = repeatUsers(data, { startDate: '2021-09-02' });
    let facSummary = repeatUsers(data, {
      population: 'faculty',
      startDate: '2021-09-02',
    });
    let staffSummary = repeatUsers(data, {
      population: 'staff',
      startDate: '2021-09-02',
    });
    let stuSummary = repeatUsers(data, {
      population: 'student',
      startDate: '2021-09-02',
    });
    res.setHeader('Content-Type', 'application/json');
    res.end(
      JSON.stringify({
        student: stuSummary,
        faculty: facSummary,
        staff: staffSummary,
        all: allSummary,
      })
    );
  });

  app.get('/stats', async (req, res) => {
    data = getUsageData();
    const usageReport = require('./helpers/reportUsage');
    let dayStats = usageReport(data, 'day', { startDate: '2021-09-02' });
    let monthStats = usageReport(data, 'month', { startDate: '2021-09-02' });
    let monthStuStats = usageReport(data, 'month', {
      startDate: '2021-09-02',
      population: 'student',
    });
    let dayStuStats = usageReport(data, 'day', {
      startDate: '2021-09-02',
      population: 'student',
    });
    res.render('stats-data', {
      monthStats: JSON.stringify(monthStats.details),
      dayStats: JSON.stringify(dayStats.details, null, 2),
      monthStuStats: JSON.stringify(monthStuStats.details),
      dayStuStats: JSON.stringify(dayStuStats.details, null, 2),
      fs: fs,
    });
  });
};
