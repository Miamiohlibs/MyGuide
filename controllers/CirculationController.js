const config = require('config');
const useCirc = config.get('app.useCirc');
const sierraConf = config.get('sierra');
const circSystem = config.get('circSystem');
const SierraDataGetter = require('../models/circulation/sierra/SierraDataGetter');
const CircConnectionHandler = require('../models/circulation/CircConnectionHandler');

module.exports = class CirculationController {
  constructor() {
    switch (circSystem) {
      case 'Sierra':
        this.circDataGetter = new SierraDataGetter(sierraConf);
        break;
      default:
        throw new Error('circ system not found');
    }
  }

  async getUserData(userId) {
    if (useCirc === false) {
      return {};
    }
    try {
      let connection = new CircConnectionHandler(this.circDataGetter);
      let res = await connection.getUserData(userId);
      res.circSystem = circSystem; //adds in system name for viewer
      return res;
    } catch (err) {
      console.log(err);
      return {};
    }
  }
};
