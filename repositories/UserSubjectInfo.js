const _ = require('lodash');

module.exports = class UserSubjectInfo {
  constructor(userLoginInfo, subjectMap) {
    this.user = userLoginInfo;
    this.map = subjectMap;
    this.subjects = [];
    this.subjectNames = [];
    this.libguideSubjects = [];
  }

  getSubjByRegCode(regCode) {
    let res = _.filter(this.map, { regCodes: [{ regCode: regCode }] });
    if (res.length == 1) {
      return res[0];
    }
    return false;
  }

  getRegCodeFromCourseNumber(courseNumber, regex) {
    // const str = 'ACC123';
    // const re = /(^[A-Z]+)/;
    const found = courseNumber.match(regex);
    if (found !== null && found[1]) {
      return found[1];
    }
    return false;
  }
};
