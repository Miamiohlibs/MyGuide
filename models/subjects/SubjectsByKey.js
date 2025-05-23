const config = require('config');
const approot = require('app-root-path');
// subjFile = config.get('app.subjectConfigFilename');

module.exports = class SubjectsByKey {
  constructor(subjectConfig) {
    if (!subjectConfig) {
      throw new Error('No subjectConfig provided to SubjectsByKey');
    }
    this.subjects = subjectConfig || [];
    // console.log('SubjectsByKey: ', this.subjects);
  }

  getSubjectsData() {
    return this.subjects;
  }

  getSubjectByRegCode(regCodeToFind) {
    if (!regCodeToFind) {
      return {};
    }
    return (
      this.subjects.find((entry) =>
        entry.regCodes?.some(
          (rc) => rc.regCode.toUpperCase() === regCodeToFind.toUpperCase()
        )
      ) || {}
    );
  }

  getSubjectByMajorCode(majorCodeToFind) {
    if (!majorCodeToFind) {
      return {};
    }
    return (
      this.subjects.find((entry) =>
        entry.majorCodes?.some(
          (mc) => mc.majorCode.toUpperCase() === majorCodeToFind.toUpperCase()
        )
      ) || {}
    );
  }

  getSubjectByDeptCode(subjectCodeToFind) {
    if (!subjectCodeToFind) {
      return {};
    }
    return (
      this.subjects.find((entry) =>
        entry.deptCodes?.some(
          (dc) => dc.deptCode.toUpperCase() === subjectCodeToFind.toUpperCase()
        )
      ) || {}
    );
  }
};
