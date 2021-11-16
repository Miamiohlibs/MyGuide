const _ = require('lodash');

module.exports = class UserSubjectInfo {
  constructor(userLoginInfo, subjectMap) {
    this.user = userLoginInfo;
    this.courses = [];
    this.map = subjectMap;
    this.subjects = [];
    this.subjectNames = [];
    this.libguideSubjects = [];
    if (this.user.attr.hasOwnProperty('coursesTaken')) {
      this.courses = this.courses.concat(this.user.attr.coursesTaken);
    }
    if (this.user.attr.hasOwnProperty('coursesTaught')) {
      this.courses = this.courses.concat(this.user.attr.coursesTaught);
    }
  }

  /* RegCode methods */
  getSubjByRegCode(regCode) {
    let res = _.filter(this.map, { regCodes: [{ regCode: regCode }] });
    if (res.length == 1) {
      return res[0];
    }
    return false;
  }

  getRegCodeFromCourseNumber(courseNumber, regex = /(^[A-Z]+)/) {
    // const str = 'ACC123';
    // const re = /(^[A-Z]+)/;
    const found = courseNumber.match(regex);
    if (found !== null && found[1]) {
      return found[1];
    }
    return false;
  }

  addSubjectsFromCourses() {
    this.courses.forEach((courseNumber) => {
      let regCode = this.getRegCodeFromCourseNumber(courseNumber);
      let subject = this.getSubjByRegCode(regCode);
      if (subject && !this.subjects.includes(subject)) {
        this.subjects.push(subject);
      }
    });
  }

  /* MajorCode methods */

  getSubjByMajorCode(majorCode) {
    let res = _.filter(this.map, { majorCodes: [{ majorCode: majorCode }] });
    if (res.length == 1) {
      return res[0];
    }
    return false;
  }

  addSubjectsFromMajors() {
    let majorCodes = this.user.attr.majorCodes;
    majorCodes.forEach((majorCode) => {
      let subject = this.getSubjByMajorCode(majorCode);
      if (subject && !this.subjects.includes(subject)) {
        this.subjects.push(subject);
      }
    });
  }
};
