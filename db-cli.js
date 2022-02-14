/* Command-line interface for favorites */
/*
Usage: 
  node db-cli.js add <userId> <favType> <favId>
  node db-cli.js remove <userId> <favType> <favId>
  node db-cli.js delete <userId>
  node db-cli.js empty 

  favType: g, db, s 
*/

const mongoose = require('mongoose');
const db = require('./helpers/database');
require('./models/userFavorites/UserFavorites');
const Crud = mongoose.model('userFavorites');
// const Crud = require('./models/userFavorites/crudUserFavorites');
const cmd = process.argv.slice(2)[0];
const arg = process.argv.slice(2)[1];
const arg2 = process.argv.slice(2)[2];
const arg3 = process.argv.slice(2)[3];

(async () => {
  await db.connect();
  await DbCmd(cmd);
  console.log(await Crud.find());
  //   await DbCmd(cmd);
  //   const allFavorites = await Favorite.find();
  //   console.log(allFavorites);
  await db.disconnect();
})();

async function DbCmd(cmd) {
  switch (cmd) {
    case 'add':
      return await UpdateUserAdd(arg, arg2, arg3);
      break;
    case 'remove':
      return await UpdateUserRemove(arg, arg2, arg3);
      break;
    case 'delete':
      return await DeleteUser(arg);
      break;
    case 'empty':
      return await Crud.deleteMany({});
      break;
  }
  return;
}

function BuildUpdateAttr(favType, favId) {
  let attr = {};
  switch (favType) {
    case 'g':
      attr['favoriteGuides'] = favId;
      break;
    case 'db':
      attr['favoriteDatabases'] = favId;
      break;
    case 's':
      attr['favoriteSubjects'] = favId;
      break;
  }
  return attr;
}

async function DeleteUser(userId) {
  return await Crud.deleteOne({ userId: userId });
}
async function UpdateUserAdd(userId, favType, favId) {
  let attr = BuildUpdateAttr(favType, favId);
  return await Crud.findOneAndUpdate(
    { userId: userId },
    { $addToSet: attr, updated: Date.now() },
    { upsert: true }
  );
}
async function UpdateUserRemove(userId, favType, favId) {
  let attr = BuildUpdateAttr(favType, favId);
  return await Crud.findOneAndUpdate(
    { userId: userId },
    { $pull: attr, updated: Date.now() },
    { upsert: true }
  );
}
