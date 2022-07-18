const path = require('path');
const fs = require('fs-extra');
const dayjs = require('dayjs');
const hash = require('sha256');
const outputPath = path.join(__dirname, '..', '..', 'logs', 'usageLog.txt');
fs.ensureFileSync(outputPath);

const logUser = function (u) {
  let now = dayjs().format();
  let data = {
    time: now,
  };
  if (u.person.userId) {
    data.user = hash(u.person.userId);
  }
  if (u.courseDepts) {
    data.courseDepts = u.courseDepts;
  }
  if (u.person.majorNames) {
    data.majors = u.person.majorNames;
  }
  if (u.person.departmentName) {
    data.departments = u.person.departmentName;
  }
  if (u.person.divisionName) {
    data.divisions = u.person.divisionName;
  }
  if (
    u.favorites &&
    u.favorites.favoriteSubjects &&
    u.favorites.favoriteSubjects
  ) {
    data.favorites = u.favorites.favoriteSubjects;
  }
  if (u.uniqueSubjects) {
    data.subjects = u.uniqueSubjects;
  }
  if (u.person.userType) {
    data.primaryAffiliation = u.person.userType;
  }
  fs.appendFile(outputPath, '\n' + JSON.stringify(data));
};

module.exports = logUser;
