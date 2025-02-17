// const Base64 = require('js-base64').Base64;
const axios = require('axios');

module.exports = class AlamApi {
  constructor(conf) {
    this.conf = conf;
    this.apiKey = conf.credentials.apiKey;
    this.urlPrefix = 'https://' + conf.server + conf.apiPath;
  }

  async query(endpoint, user, params = {}, method = 'get') {
    params.apiKey = this.apiKey;
    let json = await axios({
      method: method,
      url: this.urlPrefix + '/' + user + endpoint,
      params: params,
    });
    return json;
  }
};
