const config = require('config');
const approot = require('app-root-path');
const FavoritesApi = require(approot + '/models/userFavorites/FavoritesApi');
const api = new FavoritesApi();
const Logger = require(approot + '/helpers/Logger');
const HashId = require(approot + '/helpers/hashId');

module.exports = class userFavoritesController {
  constructor(userId) {
    this.userId = userId;
    this.hashId = HashId(userId);
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
      Logger.error({ message: err.message });
      return { success: false, message: err.message, error: err };
    }
  }
  async updateFavoriteAdd(favType, favId) {
    try {
      console.log('updateAdd in Controller:', this.hashId, favType, favId);
      await api.UpdateFavoritesAdd(this.hashId, favType, favId);
      return { success: true };
    } catch (err) {
      Logger.error({ message: err.message });
      return { success: false, message: err.message, error: err };
    }
  }
  async updateFavoriteRemove(favType, favId) {
    try {
      console.log('updateRemove in Controller:', this.hashId, favType, favId);
      await api.UpdateFavoritesRemove(this.hashId, favType, favId);
      return { success: true };
    } catch (err) {
      Logger.error({ message: err.message });
      return { success: false, message: err.message, error: err };
    }
  }
};
