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
      'https://api-eu.hosted.exlibrisgroup.com/almaws/v1/users'
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
    response = await api.query('/fake/endpoint', 'fakeUser');
    expect(axios).toHaveBeenCalledTimes(1);
    expect(axios).toHaveBeenCalledWith({
      method: 'get',
      url: 'https://api-eu.hosted.exlibrisgroup.com/almaws/v1/users/fakeUser/fake/endpoint',
      params: { apiKey: 'fakeApiKey' },
    });
    expect(JSON.stringify(response)).toBe(
      JSON.stringify({ data: { fake: 'data' } })
    );
  });

  //   it('should make a GET query with just an endpoint + params and return a value', async () => {
  //     response = await api.query('/fake/endpoint2', { fakeParam: 'data' });
  //     expect(axios).toHaveBeenCalledTimes(1);
  //     expect(axios).toHaveBeenCalledWith({
  //       method: 'get',
  //       url: 'https://fakeserver.univ.edu/iii/sierra-api/fake/endpoint2',
  //       params: { fakeParam: 'data' },
  //       headers: {
  //         Authorization: 'Bearer undefined',
  //       },
  //     });
  //     expect(JSON.stringify(response)).toBe(
  //       JSON.stringify({ data: { fake: 'data' } })
  //     );
  //   });

  //   it('should make a POST query with (endpoint, {}, "POST") params and return a value', async () => {
  //     response = await api.query(
  //       '/fake/endpoint3',
  //       { fakeParam: 'data' },
  //       'post'
  //     );
  //     expect(axios).toHaveBeenCalledTimes(1);
  //     expect(axios).toHaveBeenCalledWith({
  //       method: 'post',
  //       url: 'https://fakeserver.univ.edu/iii/sierra-api/fake/endpoint3',
  //       params: { fakeParam: 'data' },
  //       headers: {
  //         Authorization: 'Bearer undefined',
  //       },
  //     });
  //     expect(JSON.stringify(response)).toBe(
  //       JSON.stringify({ data: { fake: 'data' } })
  //     );
  //   });
  // });

  // describe('SierraApi: getToken()', () => {
  //   beforeEach(async () => {
  //     jest.clearAllMocks();
  //     api = new SierraApi(fakeSierraConf.sierra);
  //     axios.mockImplementation(async () =>
  //       Promise.resolve({
  //         data: {
  //           access_token: 'fakeAccessToken',
  //           token_type: 'bearer',
  //           expires_in: 3600,
  //         },
  //       })
  //     );
  //     response = await api.getToken();
  //   });
  //   it('should post an axios request to the url provided in the config file', () => {
  //     expect(axios).toHaveBeenCalledTimes(1);
  //     expect(axios).toHaveBeenCalledWith({
  //       method: 'post',
  //       url: 'https://fakeserver.univ.edu/iii/sierra-api/v6/token',
  //       headers: {
  //         Authorization: 'Basic ZmFrZUFwaUtleTpmYWtlQ2xpZW50U2VjcmV0',
  //       },
  //     });
  //   });
  //   it('should return the token value it gets from axios', () => {
  //     expect(response).toBe('fakeAccessToken');
  //   });
  // });

  // describe('SierraApi: findPatron', () => {
  //   beforeEach(async () => {
  //     jest.clearAllMocks();
  //     api = new SierraApi(fakeSierraConf.sierra);
  //     querySpy = jest.spyOn(api, 'query').mockImplementation((url, params) => {
  //       return { data: { id: 12345, moneyOwed: 12.34 } };
  //     });
  //     response = await api.patronFind({ fakeParams: 'params' });
  //   });
  //   it('should make a call to /v6/patrons/find and return its response', () => {
  //     expect(querySpy).toHaveBeenCalledTimes(1);
  //     expect(querySpy).toHaveBeenCalledWith('/v6/patrons/find', {
  //       fakeParams: 'params',
  //     });
  //     expect(JSON.stringify(response)).toBe(
  //       JSON.stringify({ data: { id: 12345, moneyOwed: 12.34 } })
  //     );
  //   });
  // });

  // describe('SierraApi: patronQuery', () => {
  //   beforeEach(async () => {
  //     jest.clearAllMocks();
  //     api = new SierraApi(fakeSierraConf.sierra);
  //     querySpy = jest.spyOn(api, 'query').mockImplementation((url, params) => {
  //       return { data: { total: 3 } };
  //     });
  //     response = await api.patronQuery('checkouts', '12345');
  //   });
  //   it('should make a call to /v6/patrons/12345/checkouts and return its response', () => {
  //     expect(querySpy).toHaveBeenCalledTimes(1);
  //     expect(querySpy).toHaveBeenCalledWith('/v6/patrons/12345/checkouts');
  //     expect(JSON.stringify(response)).toBe(
  //       JSON.stringify({ data: { total: 3 } })
  //     );
  //   });
});
