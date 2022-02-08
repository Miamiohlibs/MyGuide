/*
    foreach item in miami_subjects
    identify the libguides subject -> subjects
    from each subject get the libns, guides, and databases + metadata

    foreach name, majorName, deptName, regName: write out a file with all that info

    The script reads the cached Librarians, Databases, and Guides (LD&G); then for each 
    subject, it outputs a the combined data from LD&G for that subject into a file:  
    /cache/subjects/[SubjectName].js 

    These cached subject files are the main data used by the Dashboard.
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
const LibAppsDataFilter = require(rootdir +
  '/models/libGuides/LibAppsDataFilter');
const f = new LibAppsDataFilter();

subjectConfig.forEach((subject) => {
  let libguides = subject.libguides;
  let libguidesData = getLibGuidesData(libguides);
  let subjectNames = getAllSubjectNames(subject);
  subjectNames.forEach((subjectName) => {
    // write out the libguidesdata to a file based on the subjectName
    let filename = filenamify(subjectName);
    let filepath = path.join(rootdir, 'cache', 'subjects', filename + '.json');
    // console.log(filename);
    // console.log(libguidesData);
    if (libguidesData !== undefined) {
      fs.writeFileSync(filepath, JSON.stringify(libguidesData, null, 2));
    }
  });
});

function getLibGuidesData(libguides) {
  if (libguides !== undefined && libguides !== null) {
    subj = f.findSubjectByName(subjects, libguides);
    libns = f.getBestBySubject(librarians, libguides);
    pubGuides = f.removeUnpublishedGuides(guides);

    // limit to certain libguide group ids, e.g. exclude admin guides, other campuses, etc.
    rightGroups = f.removeWrongGroups(pubGuides, allowedGroups);

    gds = f.getBestBySubject(rightGroups, libguides);
    dbs = f.getBestBySubject(databases, libguides, true);
    let results = {
      metadata: {
        sizeof: {
          librarians: libns.length,
          guides: gds.length,
          databases: dbs.length,
        },
      },
      subjects: subj,
      librarians: libns,
      guides: gds,
      databases: dbs,
    };
    return results;
  }
}

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
