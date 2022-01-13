const CircController = require('./controllers/CirculationController');
(async () => {
  let circController = new CircController();
  let res = await circController.getUserData('irwinkr');
  console.log(res);
})();
