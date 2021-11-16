const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chaiArrays = require('chai-arrays');
chai.use(chaiArrays);
const UserSubjectInfo = require('../../repositories/UserSubjectInfo');

const userData1 = require('./sample-data/loggedInData1.json');
const subjectMap1 = require('./sample-data/subjectMapMiami.json');
const badSubjMap1 = require('./sample-data/badSubjectMap1.json');

let obj = new UserSubjectInfo(userData1, subjectMap1);
let badObj = new UserSubjectInfo(userData1, badSubjMap1);

describe('UserSubjectInfo: constructor', () => {
  it('should create an object with prop "map" based on input', () => {
    expect(obj).to.have.property('map');
    expect(obj.map).to.be.an.array();
    expect(obj.map.length).to.equal(709);
  });
  it('should create an object with prop "user" based on input', () => {
    expect(obj).to.have.property('user');
    expect(obj.user).to.have.property('attr');
    expect(obj.user.attr).to.have.property('userId');
    expect(obj.user.attr.userId).to.equal('pollystu');
  });
  it('should create an object with a blank property "subjects"', () => {
    expect(obj).to.have.property('subjects');
    expect(obj.subjects).to.be.an.array();
    expect(obj.subjects.length).to.equal(0);
  });
  it('should create an object with a blank property "libguideSubjects"', () => {
    expect(obj).to.have.property('libguideSubjects');
    expect(obj.libguideSubjects).to.be.an.array();
    expect(obj.libguideSubjects.length).to.equal(0);
  });
});

describe('UserSubjectInfo: getSubjByRegCode', () => {
  let res = obj.getSubjByRegCode('ACC');
  let res2 = obj.getSubjByRegCode('AA');
  let badRes = badObj.getSubjByRegCode('ACC');

  it('should return a single object for regCode with name "Accountancy" for "ACC"', () => {
    expect(res).to.be.an('object');
    expect(res).to.have.property('name');
    expect(res.name).to.equal('Accountancy');
  });
  it('should return a single object for regCode with libguides ["Accountancy"] for "ACC"', () => {
    expect(res).to.be.an('object');
    expect(res).to.have.property('libguides');
    expect(res.libguides.length).to.equal(1);
    expect(res.libguides).to.be.equalTo(['Accountancy']);
  });
  it('should return a single object for regCode with name "Academic Affairs" for "ACC"', () => {
    expect(res2).to.be.an('object');
    expect(res2).to.have.property('name');
    expect(res2.name).to.equal('Academic Affairs');
  });
  it('should return a single object for regCode with libguides ["Accountancy"] for "ACC"', () => {
    expect(res2).to.be.an('object');
    expect(res2).to.have.property('libguides');
    expect(res2.libguides.length).to.equal(1);
    expect(res2.libguides).to.be.equalTo(['Educational Leadership']);
  });
  it('should return false if two subjects share a regCode', () => {
    expect(badRes).to.be.false;
  });
});
