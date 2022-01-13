const CircController = require('./controllers/CirculationController');
(async () => {
  let res = await CircController('irwinkr');
  console.log(res);
})();
