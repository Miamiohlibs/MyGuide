module.exports = class CasDataGetter {
  constructor(conf) {
    this.conf = conf;
  }
  getUserData(userid) {
    return { status: 'received', userid: userid };
  }
};
