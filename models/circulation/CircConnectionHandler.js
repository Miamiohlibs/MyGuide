module.exports = class getCircData {
  constructor(circDataGetter) {
    this.circDataGetter = circDataGetter;
  }
  getUserData(user) {
    return this.circDataGetter.getUserData(user);
  }
};
