const approot = require('app-root-path');
const LibAppsDataFilter = require('../libGuides/LibAppsDataFilter');
const f = new LibAppsDataFilter();
const path = require('path');
const fs = require('fs');
const Logger = require(approot + '/helpers/Logger');

module.exports = class UserLibGuidesData {
  constructor(
    subjects,
    favorites = {},
    subjectCachePath = 'cache/subjects/',
    customPath = 'cache/custom/'
  ) {
    /* subjects expects to be an array of subject names
     * subjectCachePath expects an approot-relative path
     * with no leading slash, but with a trailing slash eg:
     * test/repositories/sample-data/cache/
     */
    this.subjects = subjects;
    this.favorites = favorites;
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
      fileContents = this.markFavoriteGuidesAndDatabases(fileContents);
      this.subjectData.push({
        name: subject,
        resources: fileContents,
        kenTest: true,
      });
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
        Logger.error({ message: msg, error: err });
      } else {
        Logger.error({
          message: 'Error loading file in UserLibGuidesData.getFileContents',
          error: err,
        });
      }
      fileContents = {};
    }
    return fileContents;
  }

  markFavoriteGuidesAndDatabases(contents) {
    if (
      this.favorites.favoriteGuides !== undefined &&
      contents.guides !== undefined
    ) {
      console.log(contents);
      console.log('ended contents');
      contents.guides.forEach((guide) => {
        guide.favorite = this.favorites.favoriteGuides.includes(guide.id);
      });
    }
    if (
      this.favorites.favoriteDatabases !== undefined &&
      contents.databases !== undefined
    ) {
      contents.databases.forEach((database) => {
        database.testString = 'bogusKen';
        database.favorite =
          this.favorites.favoriteDatabases.includes(database.id) ||
          this.favorites.favoriteDatabases.includes(database.id.toString());
      });
    }

    return contents;
  }
};
