const Base64 = require('js-base64').Base64;
const axios = require('axios');
const approot = require('app-root-path');
const Logger = require(approot + '/helpers/Logger');

module.exports = class SierraApi {
  constructor(conf) {
    this.conf = conf;
    let keyText = conf.credentials.apiKey + ':' + conf.credentials.clientSecret;
    this.encodedKey = Base64.encode(keyText);
    this.urlPrefix = 'https://' + conf.server + conf.apiPath;
  }

  async getToken() {
    try {
      let response = await axios({
        method: 'post',
        url: this.urlPrefix + this.conf.endpoints.token,
        headers: {
          Authorization: 'Basic ' + this.encodedKey,
        },
      });
      //   console.log(__filename);
      //   console.log('Response:', response);
      this.accessToken = response.data.access_token;
      return this.accessToken;
    } catch (error) {
      let message = `Error getting token in SierraApi: ${
        error.response?.status
      } - ${error.response?.data?.description || error.message}`;
      Logger.error(message, error);
      return error;
    }
  }

  async patronFind(params) {
    return await this.query('/v6/patrons/find', params);
  }

  async patronQuery(queryType, patronId) {
    // QueryTypes: checkouts, holds, fines
    let endpoint = '/v6/patrons/' + patronId + '/' + queryType;
    return await this.query(endpoint);
  }

  async query(endpoint, params = {}, method = 'get') {
    try {
      let json = await axios({
        method: method,
        url: this.urlPrefix + endpoint,
        params: params,
        headers: {
          Authorization: 'Bearer ' + this.accessToken,
        },
      });
      return json;
    } catch (error) {
      let message = `Error querying Sierra API at ${endpoint}: ${
        error.response?.status
      } - ${error.response?.data?.description || error.message}`;
    }
  }
};
