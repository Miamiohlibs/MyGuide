const config = require('config');
const approot = require('app-root-path');
const FavoritesApi = require(approot + '/models/userFavorites/FavoritesApi');
const api = new FavoritesApi();
const Logger = require(approot + '/services/logger');

module.exports = class userFavoritesController {
  async getFavorites(userId) {
    try {
      const userFavs = await api.GetUserFavorites(userId);
      return userFavs;
    } catch (err) {
      Logger.error({ message: err.message });
      return { success: false, message: err.message, error: err };
    }
  }
  async updateFavoriteAdd(userId, favType, favId) {
    try {
      console.log('updateAdd in Controller:', userId, favType, favId);
      await api.UpdateFavoritesAdd(userId, favType, favId);
      return { success: true };
    } catch (err) {
      Logger.error({ message: err.message });
      return { success: false, message: err.message, error: err };
    }
  }
};
