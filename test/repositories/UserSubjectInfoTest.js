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
  it('should create an object with a blank property "subjects"', () => {
    expect(obj).to.have.property('subjectNames');
    expect(obj.subjectNames).to.be.an.array();
    expect(obj.subjectNames.length).to.equal(0);
  });
  it('should create an object with a blank property "libguideSubjects"', () => {
    expect(obj).to.have.property('libguideSubjects');
    expect(obj.libguideSubjects).to.be.an.array();
    expect(obj.libguideSubjects.length).to.equal(0);
  });
  it('should have a property "courses" based on user.attr.coursesTaken', () => {
    expect(obj).to.have.property('courses');
    expect(obj.courses).to.be.an.array();
    expect(obj.courses.length).to.equal(7);
    expect(obj.courses[0]).to.equal('SPN101');
  });
});

/* testing regCode methods */
describe('UserSubjectInfo: getSubjByRegCode', () => {
  let res = obj.getSubjByRegCode('ACC');
  let res2 = obj.getSubjByRegCode('AA');
  let badRes = badObj.getSubjByRegCode('ACC');

  it('should return a single object with name "Accountancy" for "ACC"', () => {
    expect(res).to.be.an('object');
    expect(res).to.have.property('name');
    expect(res.name).to.equal('Accountancy');
  });
  it('should return a single object with libguides ["Accountancy"] for "ACC"', () => {
    expect(res).to.be.an('object');
    expect(res).to.have.property('libguides');
    expect(res.libguides.length).to.equal(1);
    expect(res.libguides).to.be.equalTo(['Accountancy']);
  });
  it('should return a single object with name "Academic Affairs" for "AA"', () => {
    expect(res2).to.be.an('object');
    expect(res2).to.have.property('name');
    expect(res2.name).to.equal('Academic Affairs');
  });
  it('should return a single object with libguides ["Educational Leadership"] for "AA"', () => {
    expect(res2).to.be.an('object');
    expect(res2).to.have.property('libguides');
    expect(res2.libguides.length).to.equal(1);
    expect(res2.libguides).to.be.equalTo(['Educational Leadership']);
  });
  it('should return false if two subjects share a regCode', () => {
    expect(badRes).to.be.false;
  });
});

describe('UserSubjectInfo: getRegCodeFromCourseNumber', () => {
  let reAlphaCodeFirst = /^([A-Z]+)/;
  let reUnorderedAlpha = /([A-Z]+)/;
  let reLowerCaseAlphaCode = /([a-z]+)/;
  it('should get "ACC" from "ACC123",/^([A-Z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('ACC123', reAlphaCodeFirst);
    expect(res).to.equal('ACC');
  });
  it('should get false from "143sdalKA",/^([A-Z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('143sdalKA', reAlphaCodeFirst);
    expect(res).to.be.false;
  });
  it('should get "ACC" from "123ACC",/([A-Z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('ACC123', reUnorderedAlpha);
    expect(res).to.equal('ACC');
  });
  it('should get "KA" from "143sdalKA",/([A-Z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('143sdalKA', reUnorderedAlpha);
    expect(res).to.equal('KA');
  });
  it('should get "acc" from "acc123",/([a-z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('acc123', reLowerCaseAlphaCode);
    expect(res).to.equal('acc');
  });
  // the ([A-Z]+)\d+ pattern should be assumed if no pattern specified
  it('should get "ACC" from "ACC123" with no pattern specified', () => {
    let res = obj.getRegCodeFromCourseNumber('ACC123');
    expect(res).to.equal('ACC');
  });
  it('should get false from "143sdalKA" with no pattern specified', () => {
    let res = obj.getRegCodeFromCourseNumber('143sdalKA');
    expect(res).to.be.false;
  });
});

describe('UserSubjectInfo: addSubjectsFromCourses', () => {
  // this should get some stub tests
});

/* testing regCode methods */

describe('UserSubjectInfo: getSubjByRegCode', () => {
  let res = obj.getSubjByMajorCode('BU01');
  let res2 = obj.getSubjByMajorCode('EA18');

  it('should return a single object with name "Accountancy" for "BU01"', () => {
    expect(res).to.be.an('object');
    expect(res).to.have.property('name');
    expect(res.name).to.equal('Accountancy');
  });
  it('should return a single object with libguides ["Accountancy"] for "BU01"', () => {
    expect(res).to.be.an('object');
    expect(res).to.have.property('libguides');
    expect(res.libguides.length).to.equal(1);
    expect(res.libguides).to.be.equalTo(['Accountancy']);
  });
  it('should return a single object with name "Adolescent Education" for "EA18"', () => {
    expect(res2).to.be.an('object');
    expect(res2).to.have.property('name');
    expect(res2.name).to.equal('Adolescent Education');
  });
  it('should return a single object with libguides ["Education"] for "EA18"', () => {
    expect(res2).to.be.an('object');
    expect(res2).to.have.property('libguides');
    expect(res2.libguides.length).to.equal(1);
    expect(res2.libguides).to.be.equalTo(['Education']);
  });
});
