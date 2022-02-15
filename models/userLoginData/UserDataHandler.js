module.exports = class UserDataHandler {
  constructor(userDataGetter) {
    this.userDataGetter = userDataGetter;
  }
  getUserData(rawUserData) {
    return this.userDataGetter.getUserData(rawUserData);
    // return { some: 'data' };
  }
};
