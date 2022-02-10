const config = require('config');
const approot = require('app-root-path');
subjFile = config.get('app.subjectConfigFilename');
const Subjects = require(approot + '/config/' + subjFile);

let subjNames = [];
Subjects.forEach((s) => {
  if (
    (s.regional === undefined || s.regional !== true) &&
    s.name !== undefined
  ) {
    subjNames.push(s.name);
  }
});

module.exports = subjNames;
