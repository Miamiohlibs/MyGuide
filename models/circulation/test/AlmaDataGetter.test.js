const AlmaDataGetter = require('../alma/AlmaDataGetter');
const AlmaApi = require('../alma/AlmaApi');
const sampleUser = require('./sample-data/sampleAlmaUserResponse.json');
const sampleFines = require('./sample-data/sampleAlmaFinesResponse.json');
const sampleHolds = require('./sample-data/sampleAlmaHoldsResponse.json');
const sampleCheckouts = require('./sample-data/sampleAlmaCheckoutsResponse.json');
const yaml = require('js-yaml');
const fs = require('fs');
// const jest = require('jest');
// Read test confs
const fakeAlmaConf = yaml.load(
  fs.readFileSync(__dirname + '/sample-data/fakeAlmaConfig.yml', 'utf8')
);
const getter = new AlmaDataGetter(fakeAlmaConf.alma);

describe('AlmaDataGetter: constructor', () => {
  it('should take in a config file and set it to this.conf', () => {
    expect(getter.conf.credentials.apiKey).toBe('fakeApiKey');
    expect(getter.alma.conf.credentials.apiKey).toBe('fakeApiKey');
  });
  it('should initialize a new AlmaApi with that config', () => {
    expect(getter.alma).toBeInstanceOf(AlmaApi);
  });
});

const createUserSpy = jest.spyOn(getter, 'createUserObject');
const patronQuerySpy = jest
  .spyOn(getter.alma, 'patronQuery')
  .mockImplementation((queryType) => {
    if (queryType === 'checkouts') {
      return Promise.resolve({ data: sampleCheckouts });
    } else if (queryType === 'holds') {
      return Promise.resolve({ data: sampleHolds });
    } else if (queryType === 'fines') {
      return Promise.resolve({ data: sampleFines });
    } else {
      return Promise.resolve({ data: sampleUser });
    }
  });

describe('AlmaDataGetter: createUserObject', () => {
  beforeEach(() => {
    getter.createUserObject('fakeykl');
  });
  it('should create a user object', () => {
    expect(getter.user).toBeInstanceOf(Object);
    expect(getter.user.id).toBe('fakeykl');
    expect(getter.user.display).toEqual({});
  });
});

describe('AlmaDataGetter: getUserData', () => {
  beforeEach(async () => {
    patronQuerySpy.mockClear();
    createUserSpy.mockClear();
  });

  it('should call Alma.createUserObject once', async () => {
    let res = await getter.getUserData('fakeykl');
    expect(createUserSpy).toHaveBeenCalledTimes(1);
    expect(createUserSpy).toHaveBeenCalledWith('fakeykl');
    expect(getter.user.id).toBe('fakeykl');
    expect(patronQuerySpy).toHaveBeenCalledTimes(3);
    expect(patronQuerySpy).toHaveBeenCalledWith('checkouts', 'fakeykl');
    expect(patronQuerySpy).toHaveBeenCalledWith('holds', 'fakeykl');
    expect(patronQuerySpy).toHaveBeenCalledWith('fines', 'fakeykl');
    expect(getter.user.display).toEqual({
      numCheckouts: 14,
      numHolds: 2,
      fines: 35.54,
    });
    expect(getter.user.display.numCheckouts).toBe(14);
    expect(getter.user.display.numHolds).toBe(2);
    expect(getter.user.display.fines).toBe(35.54);
  });
});

// describe('SierraDataGetter: getNumCheckouts', () => {
//   beforeEach(async () => {
//     jest.clearAllMocks();
//   });
//   it('should call SierraApi.query once with endpoint checkouts', async () => {
//     getter.createUserObject('smithj'); //required for setting up next query
//     await getter.getPatronBaseInfo(); //required for setting up next query
//     await getter.getNumCheckouts();
//     expect(patronQuerySpy).toHaveBeenCalledTimes(1);
//     expect(patronQuerySpy).toHaveBeenCalledWith('checkouts', 12345);
//   });
//   it('should return 3 checkouts', () => {
//     expect(getter.user.display.numCheckouts).toBe(3);
//   });
// });
// describe('SierraDataGetter: getNumHolds', () => {
//   beforeEach(async () => {
//     jest.clearAllMocks();
//   });
//   it('should call SierraApi.query once with endpoint checkouts', async () => {
//     getter.createUserObject('smithj'); //required for setting up next query
//     await getter.getPatronBaseInfo(); //required for setting up next query
//     await getter.getNumHolds();
//     expect(patronQuerySpy).toHaveBeenCalledTimes(1);
//     expect(patronQuerySpy).toHaveBeenCalledWith('holds', 12345);
//   });
//   it('should return 3 checkouts', () => {
//     expect(getter.user.display.numHolds).toBe(3);
//   });
// });
// describe('SierraDataGetter: getAccountLink', () => {
//   it('should get add the patron account link to user display data', () => {
//     getter.getAccountLink();
//     expect(getter.user.display.accountLink).toBe(
//       'https://fakeserver.univ.edu/patroninfo.html'
//     );
//   });
// });
// describe('SierraDataGetter: getUserData', () => {
//   beforeEach(async () => {
//     jest.clearAllMocks();
//     // getter = new SierraDataGetter(fakeSierraConf.sierra);
//     tokenSpy = jest.spyOn(getter.sierra, 'getToken').mockImplementation(() => {
//       Promise.resolve({ data: { access_token: 'fakeAccessToken' } });
//     });
//     createUserSpy = jest.spyOn(getter, 'createUserObject');
//     getPatronSpy = jest
//       .spyOn(getter, 'getPatronBaseInfo')
//       .mockImplementation(() => {});
//     numCheckoutsSpy = jest
//       .spyOn(getter, 'getNumCheckouts')
//       .mockImplementation(() => {
//         Promise.resolve({
//           data: {
//             total: 4,
//           },
//         });
//       });
//     numHoldsSpy = jest.spyOn(getter, 'getNumHolds').mockImplementation(() => {
//       Promise.resolve({
//         data: {
//           total: 2,
//         },
//       });
//     });
//     accountLinkSpy = jest.spyOn(getter, 'getAccountLink');
//     response = await getter.getUserData('username');
//   });
//   it('should get a SierraApi token', async () => {
//     expect(tokenSpy).toHaveBeenCalledTimes(1);
//   });
//   it('should call createUserObject', () => {
//     expect(createUserSpy).toHaveBeenCalledTimes(1);
//     expect(createUserSpy).toHaveBeenCalledWith('username');
//   });
//   it('should call getPatronBaseInfo', () => {
//     expect(getPatronSpy).toHaveBeenCalledTimes(1);
//   });
//   it('should call getNumCheckouts', () => {
//     expect(numCheckoutsSpy).toHaveBeenCalledTimes(1);
//   });
//   it('should call getNumHolds', () => {
//     expect(numHoldsSpy).toHaveBeenCalledTimes(1);
//   });
//   it('should call getPatronLink', () => {
//     expect(accountLinkSpy).toHaveBeenCalledTimes(1);
//   });
// });

// // describe('SierraDataGetter: createUserObject', () => {
// //   // getter = new SierraDataGetter(fakeSierraConf.sierra);
// //   getter.createUserObject('smithj');
// //   expect(getter.user).toBeInstanceOf(Object);
// //   expect(getter.user.id).toBe('smithj');
// //   expect(getter.user.display).toEqual({});
// // });
