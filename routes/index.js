const config = require('config');
const UserDataController = require('../controllers/UserDataController');
const UserFavoritesController = require('../controllers/UserFavoritesController');
const CircController = require('../controllers/CirculationController');
const SubjectController = require('../controllers/SubjectController');
const circController = new CircController();
const fs = require('fs');
const logUsage = require('../models/usageLog/logUser');
const { response } = require('express');
const getUsageData = require('../helpers/getUsageData');
const getRepeatUsers = require('../helpers/getRepeatUsers');
const { model } = require('mongoose');

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
router.get('/favorites/subjects', async (req, res) => {
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
router.post('/favorites/subjects/add', async (req, res) => {
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
router.post('/favorites/subjects/remove', async (req, res) => {
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
router.post('/favorites/databases/add', async (req, res) => {
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
router.post('/favorites/databases/remove', async (req, res) => {
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
router.post('/favorites/guides/add', async (req, res) => {
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
router.post('/favorites/guides/remove', async (req, res) => {
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

module.exports = router;
