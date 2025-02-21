const AlmaApi = require('../alma/AlmaApi');
const yaml = require('js-yaml');
const fs = require('fs');
const sampleUser = require('./sample-data/sampleAlmaUserResponse.json');
const sampleFines = require('./sample-data/sampleAlmaFinesResponse.json');
const sampleHolds = require('./sample-data/sampleAlmaHoldsResponse.json');
const sampleCheckouts = require('./sample-data/sampleAlmaCheckoutsResponse.json');
// const Base64 = require('js-base64').Base64;
const axios = require('axios');
const { sample } = require('lodash');
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

describe('AlmaApi: listUsers -- connection test', () => {
  // note: we don't actually need the listUsers function, this is just and easy way
  // to test the connection wit no parameters
  beforeEach(async () => {
    jest.clearAllMocks();
    api = new AlmaApi(fakeAlmaConf.alma);
    listUsersSpy = jest.spyOn(api, 'query').mockImplementation(() => {});
    response = await api.listUsers();
  });
  it('should call /v1/users once', () => {
    expect(listUsersSpy).toHaveBeenCalledTimes(1);
    expect(listUsersSpy).toHaveBeenCalledWith('/v1/users');
  });
});

describe('AlmaApi: patronQuery (user)', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    api = new AlmaApi(fakeAlmaConf.alma);
    userQuerySpy = jest
      .spyOn(api, 'query')
      .mockImplementation((url, params) => {
        return { data: sampleUser };
      });
    response = await api.patronQuery('user', 'fakeykl');
  });

  it('should make a call to /v1/users/fakeykl and return its response', () => {
    expect(userQuerySpy).toHaveBeenCalledTimes(1);
    expect(userQuerySpy).toHaveBeenCalledWith('/v1/users/fakeykl');
    expect(response.data).toEqual(sampleUser);
    expect(response.data.primary_id).toBe('FAKEYKL');
    let note = response.data.user_note[0].note_text;
    expect(note).toBe('TOT CHKOUT: 1723');
  });
});

describe('AlmaApi: patronQuery (fines)', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    api = new AlmaApi(fakeAlmaConf.alma);
    fineQuerySpy = jest
      .spyOn(api, 'query')
      .mockImplementation((url, params) => {
        return { data: sampleFines };
      });
    response = await api.patronQuery('fines', 'fakeykl');
  });

  it('should make a call to /v1/users/fakeykl/fees and return its response', () => {
    expect(fineQuerySpy).toHaveBeenCalledTimes(1);
    expect(fineQuerySpy).toHaveBeenCalledWith('/v1/users/fakeykl/fees');
    expect(response.data).toEqual(sampleFines);
    expect(response.data.total_sum).toEqual(35.54);
    expect(response.data.currency).toBe('USD');
  });
});

describe('AlmaApi: patronQuery (holds)', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    api = new AlmaApi(fakeAlmaConf.alma);
    fineQuerySpy = jest
      .spyOn(api, 'query')
      .mockImplementation((url, params) => {
        return { data: sampleHolds };
      });
    response = await api.patronQuery('holds', 'fakeykl');
  });

  it('should make a call to /v1/users/fakeykl/requests and return its response', () => {
    expect(fineQuerySpy).toHaveBeenCalledTimes(1);
    expect(fineQuerySpy).toHaveBeenCalledWith('/v1/users/fakeykl/requests');
    expect(response.data).toEqual(sampleHolds);
    expect(response.data.total_record_count).toEqual(2);
  });
});

describe('AlmaApi: patronQuery (checkouts)', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    api = new AlmaApi(fakeAlmaConf.alma);
    fineQuerySpy = jest
      .spyOn(api, 'query')
      .mockImplementation((url, params) => {
        return { data: sampleCheckouts };
      });
    response = await api.patronQuery('checkouts', 'fakeykl');
  });

  it('should make a call to /v1/users/fakeykl/loans and return its response', () => {
    expect(fineQuerySpy).toHaveBeenCalledTimes(1);
    expect(fineQuerySpy).toHaveBeenCalledWith('/v1/users/fakeykl/loans');
    expect(response.data).toEqual(sampleCheckouts);
    expect(response.data.total_record_count).toEqual(14);
  });
});
