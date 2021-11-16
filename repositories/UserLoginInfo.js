const _ = require('lodash');

module.exports = class UserLoginInfo {
  constructor(opts) {
    /* opts expects:
        authType
        rawUserData (straight out of the login mechanism)
        userDataMap (what auth fields go with what agnostic fields)
        subjectDataMap (what depts/majors/minors go with what LibGuide fields)
        */
    this.authType = opts.authType;
    this.rawUserData = opts.rawUserData;
    this.userDataMap = opts.userDataMap;
    this.subjectDataMap = opts.subjectDataMap;
    this.attr = {};
  }

  // this will come late:
  // this.addUserCustomizations(); // updates this.userAttributes

  // return this.userDataPackage(); // returns subject info for user

  getAttributesFromCasData() {
    for (let prop in this.userDataMap) {
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
};
