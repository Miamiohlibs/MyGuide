const mongoose = require('mongoose');
const approot = require('app-root-path');
const db = require(approot + '/helpers/database');
require(approot + '/models/userFavorites/UserFavorites');
const Crud = mongoose.model('userFavorites');
const Logger = require(approot + '/helpers/Logger');

module.exports = class FavoriteStatsApi {
  async GetAllUserFavorites() {
    try {
      await db.connect();
      let userFavs = await Crud.find();
      await db.disconnect();
      this.data = userFavs;
      return;
    } catch (err) {
      Logger.error(err);
      return { success: false, message: err.message, error: err };
    }
  }

  getStats() {
    return {
      overall: [
        { name: 'Total Users', value: this.getTotalUsers() },
        {
          name: 'Users with Favorite Databases',
          value: this.getUsersWithFavDatabases().length,
        },
        {
          name: 'Users with Favorite Subjects',
          value: this.getUsersWithFavSubjects().length,
        },
        {
          name: 'Users with Favorite Guides',
          value: this.getUsersWithFavGuides().length,
        },
      ],
      favoriteSubjects: this.getFavSubjects(),
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
};
