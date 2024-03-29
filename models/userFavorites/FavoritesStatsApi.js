const mongoose = require('mongoose');
const approot = require('app-root-path');
const db = require(approot + '/helpers/database');
require(approot + '/models/userFavorites/UserFavorites');
const Crud = mongoose.model('userFavorites');
const Logger = require(approot + '/helpers/Logger');
const guides = require(approot + '/cache/Guides');
const databases = require(approot + '/cache/Databases');

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
      favoriteSubjects: this.getFavCounts('favoriteSubjects'),
      favoriteDatabases: this.getFavCounts('favoriteDatabases'),
      favoriteGuides: this.getFavCounts('favoriteGuides'),
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

  getFavCounts(type) {
    let allItems = this.data
      .map((user) => user[type])
      .flat()
      .sort();

    let itemCounts = [];
    allItems.forEach((subj) => {
      let index = itemCounts.findIndex((item) => item['item'] == subj);
      // console.log(subj, index);
      // console.log(subj);
      if (index == -1) {
        itemCounts.push({
          item: subj,
          count: 1,
        });
      } else {
        itemCounts[index].count++;
      }
    });
    itemCounts.sort((a, b) => b.count - a.count);

    if (type == 'favoriteGuides') {
      itemCounts.map((g) => {
        let result = guides.find((guide) => guide.id == g.item);
        g.item = result.name;
      });
    }
    if (type == 'favoriteDatabases') {
      itemCounts.map((db) => {
        let result = databases.find((database) => database.id == db.item);
        db.item = result.name;
      });
    }

    return itemCounts;
  }
};
