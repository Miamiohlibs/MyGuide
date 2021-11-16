const config = require('config');
const UserLoginInfo = require('../repositories/UserLoginInfo');
const UserSubjectInfo = require('../repositories/UserSubjectInfo');
const userDataMap = require('../config/cas_field_map.json');
let rawData, userLoginInfo;

module.exports = function (req) {
  switch (config.get('app.authType')) {
    case 'CAS':
      if (config.get('app.useFakeUser') === 'true') {
        rawUserData = require('../fakeUsers/' + config.get('app.fakeUserFile'));
      } else if (global.onServer) {
        rawUserData = req.session.cas;
      }
      userLoginInfo = new UserLoginInfo({ rawUserData, userDataMap });
      userLoginInfo.getAttributesFromCasData();
      userLoginInfo.removeDataMap();
  }

  // return userLoginInfo;
  // return rawUserData;
};
