const SampleFavs = require('./sampleFavs');

duplicateStringAndIntegerValuesInArray = (array) => {
  let newArray = [];
  array.forEach((item) => {
    if (typeof item === 'string') {
      newArray.push(item);
      if (!isNaN(parseInt(item))) {
        newArray.push(parseInt(item));
      }
    } else if (typeof item === 'number') {
      newArray.push(item);
      newArray.push(item.toString());
    }
  });
  return newArray;
};

getUserFavorites = (userId) => {
  let userFavs = SampleFavs.filter((fav) => fav.userId === userId)[0];
  if (userFavs.hasOwnProperty('favoriteGuides')) {
    userFavs.favoriteGuides = duplicateStringAndIntegerValuesInArray(
      userFavs.favoriteGuides
    );
  } else {
    userFavs.favoriteGuides = [];
  }

  if (userFavs.hasOwnProperty('favoriteDatabases')) {
    userFavs.favoriteDatabases = duplicateStringAndIntegerValuesInArray(
      userFavs.favoriteDatabases
    );
  } else {
    userFavs.favoriteDatabases = [];
  }

  if (!userFavs.hasOwnProperty('favoriteSubjects')) {
    userFavs.favoriteSubjects = [];
  }

  return userFavs;
};

module.exports = getUserFavorites;
