const config = require('config');
const UserDataHandler = require('../models/userLoginData/UserDataHandler');
const CasDataGetter = require('../models/userLoginData/cas/CasDataGetter');
const UserLoginInfo = require('../models/userLoginData/UserLoginInfo');
const UserSubjectInfo = require('../models/userLoginData/UserSubjectInfo');
const UserLibGuidesData = require('../models/userLoginData/UserLibGuidesData');
const authType = config.get('app.authType');
const subjectMap = require('../config/miami_subjects.json'); // change this to read from config for path

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

  getUserData(userLoginRawData) {
    console.log('starting UDC.getUserData');
    let dataHandler = new UserDataHandler(this.userDataGetter);
    let userLoginInfo = dataHandler.getUserData(userLoginRawData);

    let user = { attr: userLoginInfo, rawUserData: userLoginRawData };

    let userSubjectInfo = new UserSubjectInfo(user, subjectMap);
    userSubjectInfo.addSubjectsFromMajors();
    userSubjectInfo.addSubjectsFromCourses();
    userSubjectInfo.addSubjectsFromDepts();
    userSubjectInfo.reduceSubjectsToNames();
    userSubjectInfo.removeTempData();
    let subjectList = userSubjectInfo.returnSubjectList();

    let userLibGuides = new UserLibGuidesData(subjectList);

    let finishedUserData = {
      person: userLoginInfo,
      uniqueSubjects: subjectList,
      subjectData: userLibGuides,
      userLoginInfo: user.rawUserData,
    };
    return finishedUserData;
  }
};
