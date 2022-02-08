const _ = require('lodash');

module.exports = class SubjectAudit {
  constructor(filepath) {
    this.filepath = filepath;
  }

  loadData() {
    try {
      this.subjectList = require(this.filepath);
      return { valid: true };
    } catch (err) {
      return { valid: false, errorMessage: err.message };
    }
  }

  getAllCodesOfType(codeType, returnName = false) {
    let returnField = codeType;
    if (returnName) {
      returnField = codeType.replace('Code', 'Name');
    }
    let codeTypePlural = codeType + 's';
    let allCodesOfType = [];
    this.subjectList.forEach((subject) => {
      if (subject[codeTypePlural] !== undefined) {
        subject[codeTypePlural].forEach((code) => {
          if (code[codeType] !== undefined) {
            allCodesOfType.push(code[returnField]);
          }
        });
      }
    });
    return allCodesOfType;
  }

  checkForDuplicateCodes() {
    let regCodes = this.getAllCodesOfType('regCode');
    let deptCodes = this.getAllCodesOfType('deptCode');
    let majorCodes = this.getAllCodesOfType('majorCode');
    let duplicateRegCodes = regCodes.filter((code) => {
      return regCodes.indexOf(code) !== regCodes.lastIndexOf(code);
    });
    let duplicateDeptCodes = deptCodes.filter((code) => {
      return deptCodes.indexOf(code) !== deptCodes.lastIndexOf(code);
    });
    let duplicateMajorCodes = majorCodes.filter((code) => {
      return majorCodes.indexOf(code) !== majorCodes.lastIndexOf(code);
    });
    let duplicateCodes = {
      regCodes: duplicateRegCodes,
      deptCodes: duplicateDeptCodes,
      majorCodes: duplicateMajorCodes,
    };
    if (
      duplicateMajorCodes.length > 0 ||
      duplicateDeptCodes.length > 0 ||
      duplicateRegCodes.length > 0
    ) {
      return {
        valid: false,
        errorMessage: 'Duplicate codes found',
        duplicateCodes,
      };
    }
    return { valid: true };
  }

  listUniqueLibguides() {
    let libguides = this.subjectList.map((subject) => {
      return subject.libguides;
    });

    // merge array of arrays into one array
    libguides = _.flatten(libguides);

    // remove undefineds, dedupe, and sort
    libguides = _.compact(libguides);
    libguides = _.uniq(libguides);
    libguides = _.sortBy(libguides);

    return libguides;
  }

  filterRemoveFromSubjectListWhereCondition(property, value) {
    this.subjectList = this.subjectList.filter((item) => {
      return item[property] !== value;
    });
  }

  subjectsWithoutLibguides() {
    let subjectsWithoutLibguides = [];
    this.subjectList.forEach((subject) => {
      if (subject.libguides === undefined) {
        subjectsWithoutLibguides.push(subject);
      } else if (!Array.isArray(subject.libguides)) {
        subjectsWithoutLibguides.push(subject);
      } else if (subject.libguides.length === 0) {
        subjectsWithoutLibguides.push(subject);
      }
    });
    return subjectsWithoutLibguides;
  }

  subjectsWithNoName() {
    let subjectsWithNoName = [];
    this.subjectList.forEach((subject) => {
      if (subject.name === undefined || subject.name === '') {
        subjectsWithNoName.push(subject);
      }
    });
    return subjectsWithNoName;
  }

  subjectsWithNoCodes() {
    let subjectsWithNoCodes = [];
    this.subjectList.forEach((subject) => {
      if (
        (subject.regCodes === undefined || subject.regCodes.length === 0) &&
        (subject.deptCodes === undefined || subject.deptCodes.length === 0) &&
        (subject.majorCodes === undefined || subject.majorCodes.length === 0)
      ) {
        subjectsWithNoCodes.push(subject);
      }
    });
    return subjectsWithNoCodes;
  }
};
