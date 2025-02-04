const config = require('config');
const UserDataHandler = require('../models/userLoginData/UserDataHandler');
const CasDataGetter = require('../models/userLoginData/cas/CasDataGetter');
const UserLoginInfo = require('../models/userLoginData/UserLoginInfo');
const UserSubjectInfo = require('../models/userLoginData/UserSubjectInfo');
const UserLibGuidesData = require('../models/userLoginData/UserLibGuidesData');
const authType = config.get('app.authType');
const subjectMap = require('../config/miami_subjects.json'); // change this to read from config for path
const librarians = require('../cache/Librarians');
const LibAppsDataFilter = require('../models/libGuides/LibAppsDataFilter');
const libAppsDataFilter = new LibAppsDataFilter();
const _ = require('lodash');
// const getFavsByUserId = require('../models/userFavorites/getUserFavorites');
const UserFavoritesController = require('./UserFavoritesController');
let appConf = config.get('app');
const useFavorites = appConf.useFavorites || false;
const fakeUserConf = require('../config/fakeUserConf.json');
const approot = require('app-root-path');
const Logger = require(approot + '/helpers/Logger');

module.exports = class UserDataController {
  constructor(req) {
    this.rawUserData = {};
    switch (authType) {
      case 'CAS':
        // get real or fake user data
        if (config.get('app.useFakeUser') === true) {
          let fakeUserId = fakeUserConf.fakeUserId;
          let fakeUserFile = fakeUserConf.fakeUsers.filter(
            (p) => p.id === fakeUserId
          )[0].file;
          Logger.log('Using fake user:', fakeUserId, fakeUserFile);
          this.rawUserData = require(__dirname +
            '/../fakeUsers/' +
            fakeUserFile);
        } else if (global.onServer) {
          this.rawUserData = req.session.cas;
        }

        // read and parse json file config/cas_field_map.json
        let userDataMap = require('../config/cas_field_map.json');
        this.userDataGetter = new CasDataGetter(userDataMap);
        // console.log(typeof this.userDataGetter);
        break;
      default:
        throw new Error('User Data system not found');
    }
  }

  async getUserData() {
    let dataHandler = new UserDataHandler(this.userDataGetter);
    let userLoginInfo = dataHandler.getUserData(this.rawUserData);
    let favorites = {};
    if (useFavorites) {
      const userFavoritesController = new UserFavoritesController(
        userLoginInfo.userId
      );
      favorites = (await userFavoritesController.getFavorites()) || {
        userId: userFavoritesController.hashId,
        favoriteSubjects: [],
        favoriteGuides: [],
        favoriteDatabases: [],
      };

      // console.log('favorites: ' + JSON.stringify(favorites));
    }
    let user = {
      attr: userLoginInfo,
      favorites,
      rawUserData: this.rawUserData,
    };

    let userSubjectInfo = new UserSubjectInfo(user, subjectMap);
    userSubjectInfo.addSubjectsFromMajors();
    userSubjectInfo.addSubjectsFromCourses();
    userSubjectInfo.addSubjectsFromDepts();
    userSubjectInfo.reduceSubjectsToNames();
    userSubjectInfo.addSubjectsFromFavorites(); // AFTER reduceSubjectsToNames
    userSubjectInfo.removeTempData();
    let subjectList = userSubjectInfo.returnSubjectList();
    let liaisonList = libAppsDataFilter.getSubjectsByExpertEmail(
      librarians,
      userLoginInfo.email
    );

    if (liaisonList.length > 0) {
      userLoginInfo.liaisons = liaisonList;
    }
    // merge liaisonList with subjectList and return unique list
    let subjectListWithLiaisons = liaisonList.concat(subjectList);
    let uniqueSubjectList = _.uniq(subjectListWithLiaisons);

    let userLibGuides = new UserLibGuidesData(
      uniqueSubjectList,
      user.favorites
    );

    let finishedUserData = {
      person: userLoginInfo,
      uniqueSubjects: uniqueSubjectList,
      subjectData: userLibGuides,
      userLoginInfo: user.rawUserData,
      favorites: user.favorites,
    };
    return finishedUserData;
  }
};
