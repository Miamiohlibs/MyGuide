const SampleFavs = require('./sampleFavs');

getUserFavorites = (userId) => {
  let userFavs = SampleFavs.filter((fav) => fav.userId === userId);
  return userFavs[0];
};

module.exports = getUserFavorites;
