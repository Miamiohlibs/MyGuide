const LibAppsDataFilter = require('../../repositories/LibAppsDataFilter');
const f = new LibAppsDataFilter();
const path = require('path');
const fs = require('fs');

module.exports = class UserLibGuidesData {
  constructor(
    subjects,
    subjectCachePath = 'cache/subjects/',
    customPath = 'cache/custom/'
  ) {
    /* subjects expects to be an array of subject names
     * subjectCachePath expects an approot-relative path
     * with no leading slash, but with a trailing slash eg:
     * test/repositories/sample-data/cache/
     */
    this.subjects = subjects;
    this.subjectCachePath = subjectCachePath;
    this.customPath = customPath;
    this.subjectData = [];
    this.getSubjectFiles();
    return this.subjectData;
  }

  getSubjectFiles() {
    this.subjects.forEach((subject) => {
      let filename = this.getFilePath(subject, true);
      // if no custom file exists, try for a regular file
      if (!fs.existsSync(filename)) {
        filename = this.getFilePath(subject, false);
      }
      let fileContents = this.getFileContents(filename);
      this.subjectData.push({ name: subject, resources: fileContents });
    });
  }

  getFilePath(subject, custom = false) {
    let subjectPath;
    if (custom) {
      subjectPath = this.customPath;
    } else {
      subjectPath = this.subjectCachePath;
    }
    return path.join(
      __dirname,
      '..',
      '..',
      subjectPath,
      f.safeFilename(subject) + '.json'
    );
  }

  getFileContents(filename) {
    let fileContents;
    try {
      fileContents = JSON.parse(String(fs.readFileSync(filename, (err) => {})));
    } catch (err) {
      if (err.code == 'ENOENT') {
        let msg = 'File not found: ' + filename;
        console.log(msg);
      } else {
        console.log('Error:', err);
      }
      fileContents = {};
    }
    return fileContents;
  }
};
