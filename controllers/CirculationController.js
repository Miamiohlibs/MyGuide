const config = require('config');
const useCirc = config.get('app.useCirc'); // true/false
const hasSierra = config.has('sierra');
const hasAlma = config.has('alma');
const circSystem = config.get('circSystem'); // Sierra/Alma
const SierraDataGetter = require('../models/circulation/sierra/SierraDataGetter');
const AlmaDataGetter = require('../models/circulation/alma/AlmaDataGetter');
const CircConnectionHandler = require('../models/circulation/CircConnectionHandler');
const approot = require('app-root-path');
const Logger = require(approot + '/helpers/Logger');
const fakeUserConf = require('../config/fakeUserConf.json');

module.exports = class CirculationController {
  constructor() {
    switch (circSystem) {
      case 'Sierra':
        if (!hasSierra) {
          throw new Error('Sierra config not found');
        } else {
          this.ilsConf = config.get('sierra');
        }
        this.circDataGetter = new SierraDataGetter(this.ilsConf);
        break;
      case 'Alma':
        if (!hasAlma) {
          throw new Error('Alma config not found');
        } else {
          this.ilsConf = config.get('alma');
        }
        this.circDataGetter = new AlmaDataGetter(this.ilsConf);
        break;
      default:
        throw new Error('circ system not found');
    }
  }

  async getUserData(userId) {
    if (!useCirc) {
      return {};
    }
    if (
      config.get('app.useFakeUser') === true &&
      fakeUserConf.useFakeCirc == true
    ) {
      let circData = fakeUserConf.fakeCircData;
      return circData;
    }
    try {
      let connection = new CircConnectionHandler(this.circDataGetter);
      let res = await connection.getUserData(userId);
      res.circSystem = circSystem; //adds in system name for viewer
      return res;
    } catch (err) {
      Logger.error({
        message: 'Error getting user data in Circulation Controller',
        errorMessage: err.message,
        error: err,
      });
      return {};
    }
  }
};
