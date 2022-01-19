/*
    foreach item in miami_subjects
    identify the libguides subject -> subjects
    from each subject get the libns, guides, and databases + metadata

    foreach name, majorName, deptName, regName: write out a file with all that info
*/

const fs = require('fs');
const path = require('path');
const rootdir = path.dirname(__dirname);
const confPath = path.join(rootdir, 'config');
process.env['NODE_CONFIG_DIR'] = confPath;
const config = require('config');
const librarians = require(rootdir + '/cache/Librarians');
const databases = require(rootdir + '/cache/Databases');
const guides = require(rootdir + '/cache/Guides');
const subjects = require(rootdir + '/cache/Subjects');
const filenamify = require(rootdir + '/utilities/filenamify');
const subjectConfigFilename = config.get('app.subjectConfigFilename');
const subjectConfigPath = path.join(rootdir, 'config', subjectConfigFilename);
console.log('subjectConfigPath: ', subjectConfigPath);
// read the subject config file
const subjectConfig = JSON.parse(fs.readFileSync(subjectConfigPath, 'utf8'));

const allowedGroups = config.get('LibGuides.allowedGroupIds');
const LibAppsDataFilter = require(rootdir + '/repositories/LibAppsDataFilter');
const f = new LibAppsDataFilter();

subjectConfig.forEach((subject) => {
  let subjects = subject.libguides;
  let subjectNames = getAllSubjectNames(subject);
  console.log('subjectNames: ', subjectNames);
});

function getAllSubjectNames(entry) {
  let allSubjectNames = [entry.name];
  let codeTypes = ['major', 'reg', 'dept'];
  codeTypes.forEach((codeType) => {
    if (entry.hasOwnProperty(codeType + 'Codes')) {
      let codes = entry[codeType + 'Codes'];
      let subjectNames = codes.map((code) => {
        return code[codeType + 'Name'];
      });
      // merge subjectNames into allCodes
      allSubjectNames = allSubjectNames.concat(subjectNames);
    }
  });
  // remove undefined values
  allSubjectNames = allSubjectNames.filter((name) => {
    return name !== undefined;
  });
  allSubjectNames = allSubjectNames.map((str) => filenamify(str));
  //eliminate duplicates
  allSubjectNames = [...new Set(allSubjectNames)];
  return allSubjectNames;
}
