const config = require('config');
const approot = require('app-root-path');
const FavoritesApi = require(approot + '/models/userFavorites/FavoritesApi');
const api = new FavoritesApi();
const Logger = require(approot + '/helpers/Logger');
const HashId = require(approot + '/helpers/hashId');

module.exports = class userFavoritesController {
  constructor(userId, userType = null) {
    this.userId = userId;
    this.hashId = HashId(userId);
    this.userType = userType;
    console.log('UserFavoritesController:', this.hashId, this.userType);
  }

  async getFavorites() {
    try {
      const userFavs = (await api.GetUserFavorites(this.hashId)) || {
        userId: this.hashId,
        favoriteGuides: [],
        favoriteUsers: [],
        favoriteTags: [],
      };
      return userFavs;
    } catch (err) {
      Logger.error({ message: err.message, error: err });
      return { success: false, message: err.message, error: err };
    }
  }
  async updateFavoriteAdd(favType, favId) {
    try {
      Logger.info('updateFavoriteAdd:', favType, favId, this.userType);
      await api.UpdateFavoritesAdd(this.hashId, favType, favId, this.userType);
      return { success: true };
    } catch (err) {
      Logger.error({ message: err.message, error: err });
      return { success: false, message: err.message, error: err };
    }
  }
  async updateFavoriteRemove(favType, favId) {
    try {
      await api.UpdateFavoritesRemove(this.hashId, favType, favId);
      return { success: true };
    } catch (err) {
      Logger.error({ message: err.message, error: err });
      return { success: false, message: err.message, error: err };
    }
  }
  async updateUserType() {
    try {
      return await api.UpdateUserType(this.hashId, this.userType);
    } catch (err) {
      Logger.error({ message: err.message, error: err });
      return { success: false, message: err.message, error: err };
    }
  }
};
