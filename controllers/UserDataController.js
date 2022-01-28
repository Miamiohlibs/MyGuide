const config = require('config');
const UserDataHandler = require('../models/userLoginData/UserDataHandler');
const CasDataGetter = require('../models/userLoginData/cas/CasDataGetter');
const authType = config.get('app.authType');

module.exports = class UserDataController {
  constructor() {
    switch (authType) {
      case 'CAS':
        console.log('authType: cas');
        // read and parse json file config/cas_field_map.json
        let userDataMap = require('../config/cas_field_map.json');
        this.userDataGetter = new CasDataGetter(userDataMap);
        console.log(typeof this.userDataGetter);
        break;
      default:
        throw new Error('User Data system not found');
    }
  }

  getUserData(casData) {
    console.log('starting UDC.getUserData');
    let dataHandler = new UserDataHandler(this.userDataGetter);
    let userLoginInfo = dataHandler.getUserData(casData);
    return userLoginInfo;
  }
};
