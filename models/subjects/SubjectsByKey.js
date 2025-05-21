const config = require('config');
const approot = require('app-root-path');
subjFile = config.get('app.subjectConfigFilename');
const Subjects = require(approot + '/config/' + subjFile);

module.exports = class SubjectsByKey {
  constructor() {
    this.subjects = Subjects;
    // console.log('SubjectsByKey: ', this.subjects);
  }

  getSubjectsData() {
    return this.subjects;
  }

  getSubjectByRegCode(regCodeToFind) {
    return this.subjects.find((entry) =>
      entry.regCodes?.some((rc) => rc.regCode === regCodeToFind)
    );
  }

  getSubjectByMajorCode(majorCodeToFind) {
    return this.subjects.find((entry) =>
      entry.majorCodes?.some((mc) => mc.majorCode === majorCodeToFind)
    );
  }

  getSubjectByDeptCode(subjectCodeToFind) {
    return this.subjects.find((entry) =>
      entry.deptCodes?.some((dc) => dc.deptCode === subjectCodeToFind)
    );
  }
};
