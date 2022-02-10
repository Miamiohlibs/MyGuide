const mongoose = require('mongoose');
const config = require('config');
const activeDb = config.get('database.use');
// console.log(dbConf);
const logger = require('../services/Logger');
const fs = require('fs');
const path = require('path');

// const activeDb = appConf.database.use;
const connectionString = config.get('database.' + activeDb + '.connection');
// console.log('Connecting to: ' + connectionString);
let dbConfig = config.get('database.' + activeDb + '.config');
if (dbConfig.sslCA && typeof dbConfig.sslCA == 'string') {
  try {
    dbConfig.sslCA = [
      fs.readFileSync(path.join(__dirname, '..', 'certs', dbConfig.sslCA)),
    ];
  } catch (err) {
    logger.error(
      'Could not find file ' + dbConfig.sslCA + ' in the certs/ directory'
    );
  }
}

const conf = (module.exports = {
  connect: async function () {
    try {
      mongoose.Promise = global.Promise;
      await mongoose.connect(connectionString, dbConfig);
      console.log('database connected');
    } catch (err) {
      console.log(err);
    }
  },

  disconnect: async function () {
    try {
      await mongoose.connection.close();
      console.log('database disconnected');
    } catch (err) {
      console.log(err);
    }
  },
});
