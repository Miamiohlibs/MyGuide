const UserLoginInfo = require('../UserLoginInfo');

const rawCasData1 = require('./sample-data/rawCasData1.json');
const rawCasData2 = require('./sample-data/rawCasData2.json');
const userDataMapMiami = require('./sample-data/userDataMapMiami.json');
const opts1 = {
  // authType: 'CAS',
  rawUserData: rawCasData1,
  userDataMap: userDataMapMiami,
};
const opts2 = {
  // authType: 'CAS',
  rawUserData: rawCasData2,
  userDataMap: userDataMapMiami,
};

describe('UserLoginInfo: constructor', () => {
  let obj = new UserLoginInfo(opts1);
  // it('should know it has CAS data', () => {
  //   expect(obj).to.have.property('authType');
  //   expect(obj.authType).to.equal('CAS');
  // });
  it('should have user=pollystu', () => {
    expect(obj.rawUserData).toHaveProperty('user');
    expect(obj.rawUserData.user).toBe('pollystu');
  });
  it('should have displayName=Polly Glott', () => {
    expect(obj.rawUserData).toHaveProperty('attributes');
    expect(obj.rawUserData.attributes).toHaveProperty('displayName');
    expect(obj.rawUserData.attributes.displayName[0]).toBe('Polly Glott');
  });
  it('should know to map Cas.user to UserLoginInfo.userId', () => {
    expect(obj.userDataMap).toHaveProperty('userId');
    expect(obj.userDataMap.userId).toHaveProperty('field');
    expect(obj.userDataMap.userId.field).toBe('user');
    expect(obj.userDataMap.userId).toHaveProperty('fieldType');
    expect(obj.userDataMap.userId.fieldType).toBe('string');
  });
  it('should know to map Cas.attributes.displayName to UserLoginInfo.fullName', () => {
    expect(obj.userDataMap).toHaveProperty('fullName');
    expect(obj.userDataMap.fullName).toHaveProperty('field');
    expect(obj.userDataMap.fullName.field).toBe('attributes.displayName');
    expect(obj.userDataMap.fullName).toHaveProperty('fieldType');
    expect(obj.userDataMap.fullName.fieldType).toBe('arrayOfOne');
  });
});

describe('UserLoginInfo: getAttributesFromCasData - user 1', () => {
  let obj = new UserLoginInfo(opts1);
  obj.getAttributesFromCasData();
  it('should get a userId of "pollystu" from rawUserData', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).toHaveProperty('userId');
    expect(obj.attr.userId).toBe('pollystu');
  });
  it('should get a userType of "student"', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).toHaveProperty('userType');
    expect(obj.attr.userType).toBe('student');
  });
  it('should get an array of 7 "coursesTaken"', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).toHaveProperty('coursesTaken');
    expect(Array.isArray(obj.attr.coursesTaken)).toBe(true);
    expect(obj.attr.coursesTaken.length).toBe(7);
    expect(obj.attr.coursesTaken[0]).toBe('SPN101');
  });
  it('should get an array of 2 majors', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).toHaveProperty('majorCodes');
    expect(Array.isArray(obj.attr.majorCodes)).toBe(true);
    expect(obj.attr.majorCodes.length).toBe(2);
    expect(obj.attr.majorCodes[0]).toBe('AS52');
    expect(obj.attr).toHaveProperty('majorNames');
    expect(Array.isArray(obj.attr.majorNames)).toBe(true);
    expect(obj.attr.majorNames.length).toBe(2);
    expect(obj.attr.majorNames[1]).toBe('Global & Intercultural Studies');
  });
});

describe('UserLoginInfo: getAttributesFromCasData - user 2', () => {
  let obj = new UserLoginInfo(opts2);
  obj.getAttributesFromCasData();
  it('should get a userId of "rtr3825" from rawUserData2', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).toHaveProperty('userId');
    expect(obj.attr.userId).toBe('rtr3825');
  });
  it('should get a userType of "faculty"', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).toHaveProperty('userType');
    expect(obj.attr.userType).toBe('faculty');
  });
  it('should get no "coursesTaken"', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).not.toHaveProperty('coursesTaken');
  });
  it('should get an array of 3 "coursesTaught"', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).toHaveProperty('coursesTaught');
    expect(Array.isArray(obj.attr.coursesTaught)).toBe(true);
    expect(obj.attr.coursesTaught.length).toBe(3);
    expect(obj.attr.coursesTaught[0]).toBe('ENG111');
  });
  it('should get departmentCode of ["epd"]', () => {
    expect(obj).toHaveProperty('attr');
    expect(obj.attr).toHaveProperty('departmentCode');
    expect(Array.isArray(obj.attr.departmentCode)).toBe(true);
    expect(obj.attr.departmentCode.length).toBe(1);
    expect(obj.attr.departmentCode[0]).toBe('edp');
    expect(obj.attr).toHaveProperty('departmentName');
    expect(Array.isArray(obj.attr.departmentName)).toBe(true);
    expect(obj.attr.departmentName.length).toBe(1);
    expect(obj.attr.departmentName[0]).toBe('Educational Psychology');
  });
});
