module.exports = class UserDataHandler {
  constructor(userDataGetter) {
    console.log('started UserDataHandler');
    console.log('typeof userDataGetter', typeof userDataGetter);
    this.userDataGetter = userDataGetter;
  }
  getUserData(rawUserData) {
    return this.userDataGetter.getUserData(rawUserData);
    // return { some: 'data' };
  }
};
