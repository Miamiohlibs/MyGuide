// this is a demo file for the circ module; not for production
// use it as a model for writing a CircController
const demoUserId = 'irwinkr';
const config = require('config');
const sierraConf = config.get('sierra');
const circSystem = config.get('circSystem');
const SierraDataGetter = require('./sierra/SierraDataGetter');
const CircConnectionHandler = require('./CircConnectionHandler');

(async () => {
  let circDataGetter;
  switch (circSystem) {
    case 'Sierra':
      circDataGetter = new SierraDataGetter(sierraConf);
      break;
    default:
      throw new Error('circ system not found');
  }
  try {
    let connection = new CircConnectionHandler(circDataGetter);
    let res = await connection.getUserData(demoUserId);
    console.log(res);
  } catch (err) {
    console.log(err);
  }
})();
