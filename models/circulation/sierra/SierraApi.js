const Base64 = require('js-base64').Base64;
const axios = require('axios');

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
    } catch (err) {
      console.log(err);
    }
  }

  async patronFind(params) {
    return await this.query('/v5/patrons/find', params);
  }

  async patronQuery(queryType, patronId) {
    // QueryTypes: checkouts, holds, fines
    let endpoint = '/v5/patrons/' + patronId + '/' + queryType;
    return await this.query(endpoint);
  }

  async query(endpoint, params = {}, method = 'get') {
    let json = await axios({
      method: method,
      url: this.urlPrefix + endpoint,
      params: params,
      headers: {
        Authorization: 'Bearer ' + this.accessToken,
      },
    });
    return json;
  }
};
