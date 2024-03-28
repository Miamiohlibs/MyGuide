const FavoritesStatsApi = require('../models/userFavorites/FavoritesStatsApi');
const favs = new FavoritesStatsApi();
const fs = require('fs').promises;

const getFavStats = async function () {
  try {
    const data = await favs.GetAllUserFavorites();
    let json = JSON.stringify(data);
    // console.log(json);
    favs.loadJson(json);
    return favs.getStats();
  } catch (err) {
    console.error(err);
  }
};

module.exports = getFavStats;
