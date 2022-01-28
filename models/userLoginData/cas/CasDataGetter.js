const _ = require('lodash');

module.exports = class CasDataGetter {
  constructor(dataMap) {
    this.userDataMap = dataMap;
  }
  getUserData(rawUserData) {
    this.rawUserData = rawUserData;
    this.attr = {};
    this.getAttributesFromCasData();
    return this.attr;
  }

  getAttributesFromCasData() {
    // console.log(this.rawUserData);
    for (let prop in this.userDataMap) {
      // console.log(
      //   prop,
      //   this.userDataMap[prop].field,
      //   this.rawUserData[this.userDataMap[prop].field]
      // );
      let fieldPath = this.userDataMap[prop].field;
      let fieldType = this.userDataMap[prop].fieldType;
      if (fieldType == 'arrayOfOne') {
        fieldPath += '[0]';
      }
      // get the value for each property from its expected path
      let value = _.get(this.rawUserData, fieldPath);
      if (value !== undefined) {
        this.attr[prop] = value;
      }
    }
  }

  removeDataMap() {
    delete this.userDataMap;
  }
};
