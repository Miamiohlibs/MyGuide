const SierraDataGetter = require('../sierra/SierraDataGetter');
const SierraApi = require('../sierra/SierraApi');
const yaml = require('js-yaml');
const fs = require('fs');
// const jest = require('jest');
// Read test confs
const fakeSierraConf = yaml.load(
  fs.readFileSync(__dirname + '/sample-data/fakeSierraConfig.yml', 'utf8')
);
const getter = new SierraDataGetter(fakeSierraConf.sierra);

const patronFindSpy = jest
  .spyOn(getter.sierra, 'patronFind')
  .mockImplementation(() => {
    return Promise.resolve({
      data: { id: 12345, moneyOwed: 1.25 },
    });
  });
const patronQuerySpy = jest
  .spyOn(getter.sierra, 'patronQuery')
  .mockImplementation(() => {
    return Promise.resolve({ data: { total: 3 } });
  });
describe('SierraDataGetter: constructor', () => {
  it('should take in a config file and set it to this.conf', () => {
    expect(getter.conf.credentials.apiKey).toBe('fakeApiKey');
    expect(getter.conf.endpoints.token).toBe('/v5/token');
  });
  it('should initialize a new SierraApi with that config', () => {
    expect(getter.sierra).toBeInstanceOf(SierraApi);
  });
});

describe('SierraDataGetter: getPatronBaseInfo', () => {
  beforeEach(async () => {
    patronFindSpy.mockClear();
  });

  it('should call SierraApi.patronFind once', async () => {
    getter.createUserObject('smithj'); //require for setting up next query
    await getter.getPatronBaseInfo();
    expect(patronFindSpy).toHaveBeenCalledTimes(1);
    expect(patronFindSpy).toHaveBeenCalledWith({
      varFieldTag: 'u',
      varFieldContent: 'smithj',
      fields: 'moneyOwed,id',
    });

    expect(getter.user.numericId).toBe(12345);
    expect(getter.user.display.moneyOwed).toBe(1.25);
  });
});
describe('SierraDataGetter: getNumCheckouts', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  it('should call SierraApi.query once with endpoint checkouts', async () => {
    getter.createUserObject('smithj'); //required for setting up next query
    await getter.getPatronBaseInfo(); //required for setting up next query
    await getter.getNumCheckouts();
    expect(patronQuerySpy).toHaveBeenCalledTimes(1);
    expect(patronQuerySpy).toHaveBeenCalledWith('checkouts', 12345);
  });
  it('should return 3 checkouts', () => {
    expect(getter.user.display.numCheckouts).toBe(3);
  });
});
describe('SierraDataGetter: getNumHolds', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });
  it('should call SierraApi.query once with endpoint checkouts', async () => {
    getter.createUserObject('smithj'); //required for setting up next query
    await getter.getPatronBaseInfo(); //required for setting up next query
    await getter.getNumHolds();
    expect(patronQuerySpy).toHaveBeenCalledTimes(1);
    expect(patronQuerySpy).toHaveBeenCalledWith('holds', 12345);
  });
  it('should return 3 checkouts', () => {
    expect(getter.user.display.numHolds).toBe(3);
  });
});

describe('SierraDataGetter: getUserData', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    // getter = new SierraDataGetter(fakeSierraConf.sierra);
    tokenSpy = jest.spyOn(getter.sierra, 'getToken').mockImplementation(() => {
      Promise.resolve({ data: { access_token: 'fakeAccessToken' } });
    });
    createUserSpy = jest.spyOn(getter, 'createUserObject');
    getPatronSpy = jest
      .spyOn(getter, 'getPatronBaseInfo')
      .mockImplementation(() => {});
    numCheckoutsSpy = jest
      .spyOn(getter, 'getNumCheckouts')
      .mockImplementation(() => {
        Promise.resolve({
          data: {
            total: 4,
          },
        });
      });
    numHoldsSpy = jest.spyOn(getter, 'getNumHolds').mockImplementation(() => {
      Promise.resolve({
        data: {
          total: 2,
        },
      });
    });
    response = await getter.getUserData('username');
  });
  it('should get a SierraApi token', async () => {
    expect(tokenSpy).toHaveBeenCalledTimes(1);
  });
  it('should call createUserObject', () => {
    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith('username');
  });
  it('should call getPatronBaseInfo', () => {
    expect(getPatronSpy).toHaveBeenCalledTimes(1);
  });
  it('should call getNumCheckouts', () => {
    expect(numCheckoutsSpy).toHaveBeenCalledTimes(1);
  });
  it('should call getNumHolds', () => {
    expect(numHoldsSpy).toHaveBeenCalledTimes(1);
  });
});

// describe('SierraDataGetter: createUserObject', () => {
//   // getter = new SierraDataGetter(fakeSierraConf.sierra);
//   getter.createUserObject('smithj');
//   expect(getter.user).toBeInstanceOf(Object);
//   expect(getter.user.id).toBe('smithj');
//   expect(getter.user.display).toEqual({});
// });

describe('Sierra Fake Test', () => {
  it('should do basic addition', () => {
    expect(1 + 1).toBe(2);
  });
});
