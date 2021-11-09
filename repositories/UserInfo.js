module.exports = class UserInfo {
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
  }
  // switch (this.authType) {
  //   case 'CAS':
  //     this.getAttributesFromCasData(); // creates this.userAttributes
  //     break;
  // }

  // this.addUserCustomizations(); // updates this.userAttributes

  // return this.userDataPackage(); // returns subject info for user
};
