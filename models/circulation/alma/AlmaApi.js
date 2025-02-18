// const Base64 = require('js-base64').Base64;
const axios = require('axios');

module.exports = class AlamApi {
  constructor(conf) {
    this.conf = conf;
    this.apiKey = conf.credentials.apiKey;
    this.urlPrefix = 'https://' + conf.server + conf.apiPath;
  }

  async query(endpoint, params = {}, method = 'get') {
    params.apiKey = this.apiKey;
    let json = await axios({
      method,
      url: this.urlPrefix + endpoint,
      params,
    });
    return json;
  }

  async patronQuery(queryType, patronId) {
    // QueryTypes: checkouts, holds, fines
    let endpoint = '/v1/users/' + patronId + '/' + queryType;
    return await this.query(this.urlPrefix + endpoint);
  }
};
