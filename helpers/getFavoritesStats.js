const FavoritesStatsApi = require('../models/userFavorites/FavoritesStatsApi');
const favs = new FavoritesStatsApi();
const fs = require('fs').promises;

const getFavStats = async function () {
  try {
    await favs.GetAllUserFavorites();
    return favs.getStats();
  } catch (err) {
    console.error(err);
  }
};

module.exports = getFavStats;
