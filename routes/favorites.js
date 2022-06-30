const config = require('config');
const UserDataController = require('../controllers/UserDataController');
const UserFavoritesController = require('../controllers/UserFavoritesController');
const SubjectController = require('../controllers/SubjectController');

const router = require('express').Router();

router.get('/subjects', async (req, res) => {
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
router.post('/subjects/add', async (req, res) => {
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
router.post('/subjects/remove', async (req, res) => {
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
router.post('/databases/add', async (req, res) => {
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
router.post('/databases/remove', async (req, res) => {
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
router.post('/guides/add', async (req, res) => {
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
router.post('/guides/remove', async (req, res) => {
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
