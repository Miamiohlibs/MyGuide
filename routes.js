const config = require('config');
// const getUserLoginInfo = require('./services/getUserInfo');
const UserDataController = require('./controllers/UserDataController');
const UserFavoritesController = require('./controllers/UserFavoritesController');
const userFavoritesController = new UserFavoritesController();
const CircController = require('./controllers/CirculationController');
const SubjectController = require('./controllers/SubjectController');
const circController = new CircController();
const fs = require('fs');
const logUsage = require('./models/usageLog/logUser');
const { response } = require('express');
// const bodyParser = require('body-parser');

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

  app.get('/favorites', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = userDataController.getUserData();
    userId = user.person.userId;
    let favs = await userFavoritesController.getFavorites(userId);
    res.send(favs);
  });
  app.get('/favorites/subjects', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = userDataController.getUserData();
    userId = user.person.userId;
    let subjController = new SubjectController();
    let subjects = subjController.getSubjects();
    let favs = await userFavoritesController.getFavorites(userId, req.query.id);
    res.render('favorites', { favorites: favs, subjects: subjects });
  });
  app.post('/favorites/subjects/add', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = userDataController.getUserData();
    userId = user.person.userId;
    let favs = await userFavoritesController.updateFavoriteAdd(
      userId,
      'subject',
      req.body.subjectToAdd
    );
    res.redirect('/favorites/subjects');
  });
  app.post('/favorites/subjects/remove', async (req, res) => {
    const userDataController = new UserDataController(req);
    let user = userDataController.getUserData();
    userId = user.person.userId;
    let favs = await userFavoritesController.updateFavoriteRemove(
      userId,
      'subject',
      req.body.subjectToRemove
    );
    res.redirect('/favorites/subjects');
  });
  app.get('/redir', (req, res) => {
    res.redirect('/');
  });
};
