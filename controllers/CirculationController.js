const config = require('config');
const sierraConf = config.get('sierra');
const circSystem = config.get('circSystem');
const SierraDataGetter = require('../models/circulation/sierra/SierraDataGetter');
const CircConnectionHandler = require('../models/circulation/CircConnectionHandler');

module.exports = async (userId) => {
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
    let res = await connection.getUserData(userId);
    // console.log(res);
    return res;
  } catch (err) {
    console.log(err);
    return {};
  }
};
