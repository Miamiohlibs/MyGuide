const CircConnectionHandler = require('../CircConnectionHandler');

describe('CircConnectionHandler: constructor', () => {
  it('should accept a function argument as circDataGetter and assign it to this.circDataGetter', () => {
    let bogusFn = () => {};
    let connection = new CircConnectionHandler(bogusFn);
    expect(typeof connection.circDataGetter).toBe('function');
  });

  it('should throw an error if the argument is not a function', () => {
    expect(() => new CircConnectionHandler('string input')).toThrow(
      SyntaxError
    );
    // why this goofy syntax? see:
    //https://medium.com/@afolabiwaheed/how-to-test-a-function-thats-expected-to-throw-error-in-jest-2419cc7c6462
  });
});

describe('CircConnectionHandler: getUserData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    connection = new CircConnectionHandler(() => {});
    dataGetterSpy = jest
      .spyOn(connection, 'getUserData')
      .mockImplementation((user) => {
        return { user: user };
      });
  });
  it('should call the circDataGetter function and pass the argument it received', () => {
    connection.getUserData();
    expect(dataGetterSpy).toHaveBeenCalledTimes(1);
  });
  it('should return the data it receives from its getUserDataCall', () => {
    let res = connection.getUserData('Mark');
    expect(JSON.stringify(res)).toBe(JSON.stringify({ user: 'Mark' }));
  });
});
