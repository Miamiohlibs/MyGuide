const FavoritesStatsApi = require('../models/userFavorites/FavoritesStatsApi');
const favs = new FavoritesStatsApi();
const fs = require('fs').promises;
const approot = require('app-root-path');
const Logger = require(approot + '/helpers/Logger');

const getFavStats = async function () {
  try {
    await favs.GetAllUserFavorites();
    return favs.getStats();
  } catch (err) {
    Logger.error({ message: err.message, error: err });
  }
};

module.exports = getFavStats;
