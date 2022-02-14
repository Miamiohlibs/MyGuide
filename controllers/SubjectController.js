const SubjectNames = require('../models/subjects/SubjectNames');

module.exports = class SubjectController {
  constructor(app) {
    this.app = app;
    this.subjectNames = SubjectNames;
  }
  getSubjects() {
    return this.subjectNames;
  }
};
