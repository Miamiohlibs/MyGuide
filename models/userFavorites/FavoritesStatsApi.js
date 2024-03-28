const mongoose = require('mongoose');
const approot = require('app-root-path');
const db = require(approot + '/helpers/database');
require(approot + '/models/userFavorites/UserFavorites');
const Crud = mongoose.model('userFavorites');
const Logger = require(approot + '/helpers/Logger');

module.exports = class FavoriteStatsApi {
  loadJson(data) {
    this.data = JSON.parse(data);
  }

  getStats() {
    return {
      totalUsers: this.getTotalUsers(),
      usersWithFavDatabases: this.getUsersWithFavDatabases().length,
      usersWithFavSubjects: this.getUsersWithFavSubjects().length,
      usersWithFavGuides: this.getUsersWithFavGuides().length,
      details: this.getFavSubjects(),
    };
  }

  getTotalUsers() {
    return this.data.length;
  }

  getUsersWithFavDatabases() {
    return this.data.filter((user) => user.favoriteDatabases.length > 0);
  }

  getUsersWithFavSubjects() {
    return this.data.filter((user) => user.favoriteSubjects.length > 0);
  }

  getUsersWithFavGuides() {
    return this.data.filter((user) => user.favoriteGuides.length > 0);
  }

  getFavSubjects() {
    let allSubjects = this.data
      .map((user) => user.favoriteSubjects)
      .flat()
      .sort();
    // return an array with a count of each subject

    let subjectCounts = [];
    allSubjects.forEach((subj) => {
      let index = subjectCounts.findIndex((item) => item.subject == subj);
      // console.log(subj, index);
      // console.log(subj);
      if (index == -1) {
        subjectCounts.push({
          subject: subj,
          count: 1,
        });
      } else {
        subjectCounts[index].count++;
      }
    });
    subjectCounts.sort((a, b) => b.count - a.count);
    return subjectCounts;
  }
  async GetAllUserFavorites() {
    try {
      await db.connect();
      let userFavs = await Crud.find();
      await db.disconnect();
      return userFavs;
    } catch (err) {
      Logger.error(err);
      return { success: false, message: err.message, error: err };
    }
  }

  //   duplicateStringAndIntegerValuesInArray = (array) => {
  //     // the code seems inconsistent as to whether it expects
  //     // an array of strings or integers
  //     // so I'm going to try both
  //     // this is a bit of a hack

  //     let newArray = [];
  //     array.forEach((item) => {
  //       if (typeof item === 'string') {
  //         newArray.push(item);
  //         if (!isNaN(parseInt(item))) {
  //           newArray.push(parseInt(item));
  //         }
  //       } else if (typeof item === 'number') {
  //         newArray.push(item);
  //         newArray.push(item.toString());
  //       }
  //     });
  //     return [...new Set(newArray)]; // prevents true duplicates
  //   };
};
