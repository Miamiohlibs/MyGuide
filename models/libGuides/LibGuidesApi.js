const axios = require('axios');
const config = require('config');
const qs = require('qs');

module.exports = class LibGuidesApi {
  constructor() {
    this.conf = config.get('LibGuides'); //api_key, site_id, base_url
    console.log('this.conf:', this.conf);
  }

  async getToken() {
    const data = qs.stringify({
      client_id: this.conf.site_id,
      client_secret: this.conf.api_key,
      grant_type: 'client_credentials',
    });
    const tokenUrl = this.conf.base_url + '/1.2/oauth/token';
    console.log('tokenUrl:', tokenUrl);
    try {
      let response = await axios.post(
        'https://lgapi-us.libapps.com/1.2/oauth/token',
        data,
        { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
      );
      this.accessToken = response.data.access_token;
      console.log('accessToken:', this.accessToken);
    } catch (err) {
      console.log(err);
    }
  }
};
