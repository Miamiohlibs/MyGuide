const AlmaApi = require('./AlmaApi');
const approot = require('app-root-path');
const Logger = require(approot + '/helpers/Logger');

module.exports = class AlmaDataGetter {
  constructor(conf) {
    // this.server = conf.server;
    // console.log('initializing: ' + conf.server);
    this.conf = conf;
    this.alma = new AlmaApi(this.conf);
  }

  async getUserData(userId) {
    try {
      this.createUserObject(userId);
      await this.getNumCheckouts();
      await this.getNumHolds();
      await this.getFines();
      //       this.getAccountLink();
      return this.user.display;
    } catch (err) {
      Logger.error({
        message: 'Error getting patron info from Alma',
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

  async getNumCheckouts() {
    try {
      let res = await this.alma.patronQuery('checkouts', this.user.id);
      this.user.display.numCheckouts = res.data.total_record_count;
      return;
    } catch (err) {
      Logger.error({
        message: 'Error getting checkouts from Alma: ' + err.message,
        error: err,
      });
    }
  }
  async getNumHolds() {
    try {
      let res = await this.alma.patronQuery('holds', this.user.id);
      this.user.display.numHolds = res.data.total_record_count;
    } catch (err) {
      Logger.error({
        message: 'Error getting holds from Alma: ' + err.message,
        error: err,
      });
    }
  }
  async getFines() {
    try {
      let res = await this.alma.patronQuery('fines', this.user.id);
      this.user.display.fines = 0;
      if (res.data.total_sum > 0) {
        this.user.display.fines = res.data.total_sum;
      }
    } catch (err) {
      Logger.error({
        message: 'Error getting fines from Alma: ' + err.message,
        error: err,
      });
    }
  }
  //   getAccountLink() {
  //     this.user.display.accountLink =
  //       'https://' + this.conf.server + '/patroninfo.html';
  //   }
};
