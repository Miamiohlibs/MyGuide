const config = require('config');
let rawData;

module.exports = function (req) {
  switch (config.get('app.authType')) {
    case 'CAS':
      if (config.get('app.useFakeUser') === 'true') {
        rawUserData = require('../fakeUsers/' + config.get('app.fakeUserFile'));
      } else if (global.onServer) {
        rawUserData = req.session.cas;
      }
  }
  return rawUserData;
};
