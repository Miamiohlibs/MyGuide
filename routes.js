const config = require('config');
const UserDataController = require('./controllers/UserDataController');
const UserFavoritesController = require('./controllers/UserFavoritesController');
const CircController = require('./controllers/CirculationController');
const SubjectController = require('./controllers/SubjectController');
const circController = new CircController();
const fs = require('fs');
const logUsage = require('./models/usageLog/logUser');
const { response } = require('express');

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

  app.get('/favorites', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    const userFavoritesController = new UserFavoritesController(userId);
    let favs = await userFavoritesController.getFavorites();
    res.send(favs);
  });
  app.get('/favorites/subjects', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = await userDataController.getUserData();
    userId = user.person.userId;
    let subjController = new SubjectController();
    let subjects = subjController.getSubjects();
    const userFavoritesController = new UserFavoritesController(userId);
    let favs = await userFavoritesController.getFavorites();
    res.render('favorites', { favorites: favs, subjects: subjects });
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
};
