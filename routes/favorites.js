const config = require('config');
const UserDataController = require('../controllers/UserDataController');
const UserFavoritesController = require('../controllers/UserFavoritesController');
const SubjectController = require('../controllers/SubjectController');
const validateInput = require('../helpers/favoritesValidation');
const pjson = require('../package.json');
const version = pjson.version;
const router = require('express').Router();

router.get('/subjects', async (req, res) => {
  const userDataController = new UserDataController(req);
  let user = await userDataController.getUserData();
  userId = user.person.userId;
  let subjController = new SubjectController();
  let subjects = subjController.getSubjects();
  const userFavoritesController = new UserFavoritesController(userId);
  let favs = await userFavoritesController.getFavorites();
  let params = {
    favorites: favs,
    subjects: subjects,
    config: config.get('viewConfigs'),
    myGuideVersion: version,
  };
  if (req.query.hasOwnProperty('added')) {
    params.msg = 'Added ' + req.query.added + ' to favorites';
  } else if (req.query.hasOwnProperty('removed')) {
    params.msg = 'Removed ' + req.query.removed + ' from favorites';
  }
  res.render('favorite-subjects', params);
});

router.post('/subjects/add', async (req, res) => {
  let valid = validateInput(req.body.subjectToAdd, 'subject');
  if (!valid) {
    res.status(400);
    res.send('Invalid subject');
    return;
  }
  const userDataController = new UserDataController(req);
  let user = await userDataController.getUserData();
  userId = user.person.userId;
  const userFavoritesController = new UserFavoritesController(userId);
  let favs = await userFavoritesController.updateFavoriteAdd(
    'subject',
    req.body.subjectToAdd
  );
  res.redirect('/favorites/subjects?added=' + req.body.subjectToAdd);
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
  res.redirect('/favorites/subjects?removed=' + req.body.subjectToRemove);
});
router.post('/databases/add', async (req, res) => {
  let valid = validateInput(req.body.resourceId, 'database');
  if (!valid) {
    res.status(400);
    res.send('Invalid database id');
    return;
  }
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
  let valid = validateInput(req.body.resourceId, 'guide');
  if (!valid) {
    res.status(400);
    res.send('Invalid guide id');
    return;
  }
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
