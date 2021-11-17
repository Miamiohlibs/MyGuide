const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chaiArrays = require('chai-arrays');
chai.use(chaiArrays);
const UserLoginInfo = require('../../repositories/UserLoginInfo');

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
    expect(obj.rawUserData).to.have.property('user');
    expect(obj.rawUserData.user).to.equal('pollystu');
  });
  it('should have displayName=Polly Glott', () => {
    expect(obj.rawUserData).to.have.property('attributes');
    expect(obj.rawUserData.attributes).to.have.property('displayName');
    expect(obj.rawUserData.attributes.displayName[0]).to.equal('Polly Glott');
  });
  it('should know to map Cas.user to UserLoginInfo.userId', () => {
    expect(obj.userDataMap).to.have.property('userId');
    expect(obj.userDataMap.userId).to.have.property('field');
    expect(obj.userDataMap.userId.field).to.equal('user');
    expect(obj.userDataMap.userId).to.have.property('fieldType');
    expect(obj.userDataMap.userId.fieldType).to.equal('string');
  });
  it('should know to map Cas.attributes.displayName to UserLoginInfo.fullName', () => {
    expect(obj.userDataMap).to.have.property('fullName');
    expect(obj.userDataMap.fullName).to.have.property('field');
    expect(obj.userDataMap.fullName.field).to.equal('attributes.displayName');
    expect(obj.userDataMap.fullName).to.have.property('fieldType');
    expect(obj.userDataMap.fullName.fieldType).to.equal('arrayOfOne');
  });
});

describe('UserLoginInfo: getAttributesFromCasData - user 1', () => {
  let obj = new UserLoginInfo(opts1);
  obj.getAttributesFromCasData();
  it('should get a userId of "pollystu" from rawUserData', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.have.property('userId');
    expect(obj.attr.userId).to.equal('pollystu');
  });
  it('should get a userType of "student"', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.have.property('userType');
    expect(obj.attr.userType).to.equal('student');
  });
  it('should get an array of 7 "coursesTaken"', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.have.property('coursesTaken');
    expect(obj.attr.coursesTaken).to.be.an('array');
    expect(obj.attr.coursesTaken.length).to.equal(7);
    expect(obj.attr.coursesTaken[0]).to.equal('SPN101');
  });
  it('should get an array of 2 majors', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.have.property('majorCodes');
    expect(obj.attr.majorCodes).to.be.an('array');
    expect(obj.attr.majorCodes.length).to.equal(2);
    expect(obj.attr.majorCodes[0]).to.equal('AS52');
    expect(obj.attr).to.have.property('majorNames');
    expect(obj.attr.majorNames).to.be.an('array');
    expect(obj.attr.majorNames.length).to.equal(2);
    expect(obj.attr.majorNames[1]).to.equal('Global & Intercultural Studies');
  });
});

describe('UserLoginInfo: getAttributesFromCasData - user 2', () => {
  let obj = new UserLoginInfo(opts2);
  obj.getAttributesFromCasData();
  it('should get a userId of "rtr3825" from rawUserData2', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.have.property('userId');
    expect(obj.attr.userId).to.equal('rtr3825');
  });
  it('should get a userType of "faculty"', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.have.property('userType');
    expect(obj.attr.userType).to.equal('faculty');
  });
  it('should get no "coursesTaken"', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.not.have.property('coursesTaken');
  });
  it('should get an array of 3 "coursesTaught"', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.have.property('coursesTaught');
    expect(obj.attr.coursesTaught).to.be.an('array');
    expect(obj.attr.coursesTaught.length).to.equal(3);
    expect(obj.attr.coursesTaught[0]).to.equal('ENG111');
  });
  it('should get departmentCodes of ["epd"]', () => {
    expect(obj).to.have.property('attr');
    expect(obj.attr).to.have.property('departmentCodes');
    expect(obj.attr.departmentCodes).to.be.an('array');
    expect(obj.attr.departmentCodes.length).to.equal(1);
    expect(obj.attr.departmentCodes[0]).to.equal('edp');
    expect(obj.attr).to.have.property('departmentNames');
    expect(obj.attr.departmentNames).to.be.an('array');
    expect(obj.attr.departmentNames.length).to.equal(1);
    expect(obj.attr.departmentNames[0]).to.equal('Educational Psychology');
  });
});
