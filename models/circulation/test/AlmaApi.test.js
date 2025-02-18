const AlmaApi = require('../alma/AlmaApi');
const yaml = require('js-yaml');
const fs = require('fs');
// const Base64 = require('js-base64').Base64;
const axios = require('axios');
jest.mock('axios');

// Read test confs
const fakeAlmaConf = yaml.load(
  fs.readFileSync(__dirname + '/sample-data/fakeAlmaConfig.yml', 'utf8')
);

describe('AlmaApi: constructor', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    api = new AlmaApi(fakeAlmaConf.alma);
  });
  it('should assign the passed conf variables to this.conf', () => {
    expect(api.conf.credentials.apiKey).toBe('fakeApiKey');
    expect(api.apiKey).toBe('fakeApiKey');
  });
  it('should correctly derive a url prefix from the config', () => {
    expect(api.urlPrefix).toBe(
      'https://api-eu.hosted.exlibrisgroup.com/almaws'
    );
  });
});

describe('AlmaApi: query', () => {
  api = new AlmaApi(fakeAlmaConf.alma);
  beforeEach(async () => {
    jest.clearAllMocks();
    axios.mockImplementation(async () =>
      Promise.resolve({
        data: {
          fake: 'data',
        },
      })
    );
  });
  it('should make a GET query with just an endpoint param and return a value', async () => {
    response = await api.query('/fake/endpoint');
    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: 'https://api-eu.hosted.exlibrisgroup.com/almaws/fake/endpoint',
      params: { apiKey: 'fakeApiKey' },
    });
    expect(JSON.stringify(response)).toBe(
      JSON.stringify({ data: { fake: 'data' } })
    );
  });
});

// describe('AlmaApi: patronQuery (base user data)', () => {
//   beforeEach(async () => {
//     jest.clearAllMocks();
//     api = new AlmaApi(fakeAlmaConf.alma);
//     querySpy = jest.spyOn(api, 'query').mockImplementation((url, params) => {
//       return { data: { total: 3 } };
//     });
//     response = await api.patronQuery('checkouts', '12345');
//   });
//   //   it('should make a call to /v6/patrons/12345/checkouts and return its response', () => {
//   //     expect(querySpy).toHaveBeenCalledTimes(1);
//   //     expect(querySpy).toHaveBeenCalledWith('/v6/patrons/12345/checkouts');
//   //     expect(JSON.stringify(response)).toBe(
//   //       JSON.stringify({ data: { total: 3 } })
//   //     );
//   //   });
// });
