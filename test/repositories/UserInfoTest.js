const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chaiArrays = require('chai-arrays');
chai.use(chaiArrays);
const UserInfo = require('../../repositories/UserInfo');

const rawCasData1 = require('./sample-data/rawCasData1.json');
const userDataMapMiami = require('./sample-data/userDataMapMiami.json');
const opts1 = {
  authType: 'CAS',
  rawUserData: rawCasData1,
  userDataMap: userDataMapMiami,
};

describe('UserInfo: constructor', () => {
  let obj = new UserInfo(opts1);
  it('should know it has CAS data', () => {
    expect(obj).to.have.property('authType');
    expect(obj.authType).to.equal('CAS');
  });
  it('should have user=pollystu', () => {
    expect(obj.rawUserData).to.have.property('user');
    expect(obj.rawUserData.user).to.equal('pollystu');
  });
  it('should have displayName=Polly Glott', () => {
    expect(obj.rawUserData).to.have.property('attributes');
    expect(obj.rawUserData.attributes).to.have.property('displayName');
    expect(obj.rawUserData.attributes.displayName[0]).to.equal('Polly Glott');
  });
  it('should know to map Cas.user to UserInfo.userId', () => {
    expect(obj.userDataMap).to.have.property('userId');
    expect(obj.userDataMap.userId).to.have.property('field');
    expect(obj.userDataMap.userId.field).to.equal('user');
    expect(obj.userDataMap.userId).to.have.property('fieldType');
    expect(obj.userDataMap.userId.fieldType).to.equal('string');
  });
  it('should know to map Cas.attributes.displayName to UserInfo.fullName', () => {
    expect(obj.userDataMap).to.have.property('fullName');
    expect(obj.userDataMap.fullName).to.have.property('field');
    expect(obj.userDataMap.fullName.field).to.equal('attributes.displayName');
    expect(obj.userDataMap.fullName).to.have.property('fieldType');
    expect(obj.userDataMap.fullName.fieldType).to.equal('arrayOfOne');
  });
});

describe('UserInfo: getAttributesFromCasData', () => {
  let obj = new UserInfo(opts1);
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
});
