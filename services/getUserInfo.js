const config = require('config');
const UserLoginInfo = require('../repositories/UserLoginInfo');
const UserSubjectInfo = require('../repositories/UserSubjectInfo');
const userDataMap = require('../config/cas_field_map.json');
const subjectMap = require('../config/miami_subjects.json');
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

  let userSubjectInfo = new UserSubjectInfo(userLoginInfo, subjectMap);
  userSubjectInfo.addSubjectsFromMajors();
  userSubjectInfo.addSubjectsFromCourses();
  userSubjectInfo.reduceSubjectsToNames();
  userSubjectInfo.removeTempData();
  return userSubjectInfo;
};
