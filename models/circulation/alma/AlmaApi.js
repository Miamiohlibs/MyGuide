// const Base64 = require('js-base64').Base64;
const approot = require('app-root-path');
const axios = require('axios');
const Logger = require(approot + '/helpers/Logger');

module.exports = class AlamApi {
  constructor(conf) {
    this.conf = conf;
    this.apiKey = conf.credentials.apiKey;
    this.urlPrefix = 'https://' + conf.server + conf.apiPath;
  }

  async query(endpoint, params = {}, method = 'get') {
    params.apiKey = this.apiKey;
    try {
      let json = await axios({
        method,
        url: this.urlPrefix + endpoint,
        params,
      });
      return json;
    } catch (error) {
      let message = `Error connecting with Alma API at ${endpoint}: ${
        error.response?.status
      } - ${error.response?.data?.description || error.message}`;
      Logger.error({ message, error });
      throw new Error(message);
    }
  }

  async listUsers() {
    try {
      return await this.query('/v1/users');
    } catch (error) {
      let message = `Error running AlmaApi.listUsers: ${error.message}`;
      Logger.error({ message, error });
      throw new Error(message);
    }
  }

  async patronQuery(queryType, patronId) {
    // QueryTypes: holds, fines, checkouts, users (users has no path -- just leave off an arg)
    let queryPath = '';
    switch (queryType) {
      case 'holds':
        queryPath = '/requests';
        break;
      case 'fines':
        queryPath = '/fees';
        break;
      case 'checkouts':
        queryPath = '/loans';
        break;
      default:
        break;
    }
    let endpoint = '/v1/users/' + patronId + queryPath;
    try {
      return await this.query(endpoint);
    } catch (error) {
      let message = `Error running AlmaApi.patronQuery(${queryType}, ${patronId}): ${error.message}`;
      Logger.error({ message, error });
      throw new Error(message);
    }
  }
};
