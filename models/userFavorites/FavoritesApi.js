const mongoose = require('mongoose');
const approot = require('app-root-path');
const db = require(approot + '/services/database');
require(approot + '/models/userFavorites/UserFavorites');
const Crud = mongoose.model('userFavorites');
const Logger = require(approot + '/services/logger');

module.exports = class FavoritesApi {
  async GetUserFavorites(userId) {
    try {
      await db.connect();
      const userFavs = await Crud.findOne({ userId: userId });
      await db.disconnect();
      return userFavs;
    } catch (err) {
      Logger.error(err);
      return { success: false, message: err.message, error: err };
    }
  }
  async UpdateFavoritesAdd(userId, favType, favId) {
    try {
      await db.connect();
      let attr = this.BuildUpdateAttr(favType, favId);
      console.log('updating in API:', userId, attr);
      await Crud.findOneAndUpdate(
        { userId: userId },
        { $addToSet: attr, updated: Date.now() },
        { upsert: true }
      );
      await db.disconnect();
      return { success: true };
    } catch (err) {
      Logger.error(err);
      return { success: false, message: err.message, error: err };
    }
  }

  async UpdateFavoritesRemove(userId, favType, favId) {
    try {
      await db.connect();
      let attr = this.BuildUpdateAttr(favType, favId);
      console.log('updating in API:', userId, attr);
      await Crud.findOneAndUpdate(
        { userId: userId },
        { $pull: attr, updated: Date.now() },
        { upsert: true }
      );
      await db.disconnect();
      return { success: true };
    } catch (err) {
      Logger.error(err);
      return { success: false, message: err.message, error: err };
    }
  }

  BuildUpdateAttr(favType, favId) {
    let attr = {};
    switch (favType) {
      case 'guide':
        attr['favoriteGuides'] = favId;
        break;
      case 'database':
        attr['favoriteDatabases'] = favId;
        break;
      case 'subject':
        attr['favoriteSubjects'] = favId;
        break;
    }
    return attr;
  }
};
