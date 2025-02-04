const SierraApi = require('./SierraApi');
const approot = require('app-root-path');
const Logger = require(approot + '/helpers/Logger');

module.exports = class SierraDataGetter {
  constructor(conf) {
    // this.server = conf.server;
    // console.log('initializing: ' + conf.server);
    this.conf = conf;
    this.sierra = new SierraApi(this.conf);
  }

  async getUserData(userId) {
    try {
      await this.sierra.getToken();
    } catch (err) {
      Logger.error({ message: 'Error getting accessToken', error: err });
    }

    try {
      this.createUserObject(userId);
      await this.getPatronBaseInfo(); // gets numeric id, moneyOwed, account link
      await this.getNumCheckouts();
      await this.getNumHolds();
      this.getAccountLink();
      return this.user.display;
    } catch (err) {
      Logger.error({
        message: 'Error getting patron info from Sierra',
        error: err,
      });
    }
  }

  createUserObject(userId) {
    this.user = {
      id: userId,
      display: {},
    };
  }

  async getPatronBaseInfo() {
    try {
      const params = {
        varFieldTag: 'u', //uid
        varFieldContent: this.user.id, //received as argument
        fields: 'moneyOwed,id',
      };
      let res = await this.sierra.patronFind(params);
      this.user.numericId = res.data.id;
      this.user.display.moneyOwed = res.data.moneyOwed;
    } catch (err) {
      Logger.error({ message: err.message, error: err });
    }
  }
  async getNumCheckouts() {
    try {
      let res = await this.sierra.patronQuery('checkouts', this.user.numericId);
      this.user.display.numCheckouts = res.data.total;
    } catch (err) {
      Logger.error({ message: err.message, error: err });
    }
  }
  async getNumHolds() {
    try {
      let res = await this.sierra.patronQuery('holds', this.user.numericId);
      this.user.display.numHolds = res.data.total;
    } catch (err) {
      Logger.error({ message: err.message, error: err });
    }
  }
  getAccountLink() {
    this.user.display.accountLink =
      'https://' + this.conf.server + '/patroninfo.html';
  }
};

//   try {
//     // define params to lookup user by userid
//     // it will return an "id" needed for subsequent API calls
//
//     // console.log('Bibs response:', res.data);
//     let user = {
//       patronId: res.data.id,
//       display: {
//         moneyOwed: res.data.moneyOwed,
//         accountLink: 'https://' + this.conf.server + '/patroninfo.html',
//       },
//     };
//     let resCheckouts = await this.sierra.patronQuery(
//       'checkouts',
//       user.patronId
//     );
//     user.display.numCheckouts = resCheckouts.data.total;
//     let resHolds = await this.sierra.patronQuery('holds', user.patronId);
//     user.display.numHolds = resHolds.data.total;
//     // console.log(user.display);
//     // const sierraData = user.display;
//     return user.display;
//   } catch (err) {
//     console.log(err);
//   }
// }
