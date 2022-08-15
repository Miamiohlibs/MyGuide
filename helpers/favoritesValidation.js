const config = require('config');
const Logger = require('../helpers/Logger');
const Databases = require('../cache/Databases');
const Guides = require('../cache/Guides');
const subjectsFilename = config.get('app.subjectConfigFilename');
const Subjects = require('../config/' + subjectsFilename);

dbIds = Databases.map((db) => parseInt(db.id));
guideIds = Guides.map((guide) => parseInt(guide.id));
subjectNames = Subjects.map((subject) => subject.name);

function validateInput(input, type) {
  if (type === 'database') {
    console.log('Validating db id: ' + input, dbIds.includes(parseInt(input)));
    return dbIds.includes(parseInt(input));
  } else if (type === 'guide') {
    return guideIds.includes(parseInt(input));
  } else if (type === 'subject') {
    return subjectNames.includes(input);
  } else {
    return false;
  }
}

module.exports = validateInput;
