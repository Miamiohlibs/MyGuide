module.exports = class getCircData {
  constructor(circDataGetter) {
    if (typeof circDataGetter !== 'function') {
      throw new Error('circDataGetter must be a function');
    } else {
      this.circDataGetter = circDataGetter;
    }
  }
  getUserData(user) {
    return this.circDataGetter.getUserData(user);
  }
};
