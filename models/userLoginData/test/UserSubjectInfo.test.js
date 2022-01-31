const UserSubjectInfo = require('../UserSubjectInfo');

const userData1 = require('./sample-data/loggedInData1.json');
const subjectMap1 = require('./sample-data/subjectMapMiami.json');
const badSubjMap1 = require('./sample-data/badSubjectMap1.json');

let obj = new UserSubjectInfo(userData1, subjectMap1);
let badObj = new UserSubjectInfo(userData1, badSubjMap1);

describe('UserSubjectInfo: constructor', () => {
  it('should create an object with prop "map" based on input', () => {
    expect(obj).toHaveProperty('map');
    expect(Array.isArray(obj.map)).toBe(true);
    expect(obj.map.length).toBe(709);
  });
  it('should create an object with prop "user" based on input', () => {
    expect(obj).toHaveProperty('user');
    expect(obj.user).toHaveProperty('attr');
    expect(obj.user.attr).toHaveProperty('userId');
    expect(obj.user.attr.userId).toBe('pollystu');
  });
  it('should create an object with a blank property "subjects"', () => {
    expect(obj).toHaveProperty('subjects');
    expect(Array.isArray(obj.subjects)).toBe(true);
    expect(obj.subjects.length).toBe(0);
  });
  it('should have a property "courses" based on user.attr.coursesTaken', () => {
    expect(obj).toHaveProperty('courses');
    expect(Array.isArray(obj.courses)).toBe(true);
    expect(obj.courses.length).toBe(7);
    expect(obj.courses[0]).toBe('SPN101');
  });
});

/* testing regCode methods */
describe('UserSubjectInfo: getSubjByRegCode', () => {
  let res = obj.getSubjByRegCode('ACC');
  let res2 = obj.getSubjByRegCode('AA');
  let badRes = badObj.getSubjByRegCode('ACC');

  it('should return a single object with name "Accountancy" for "ACC"', () => {
    expect(res).toBeInstanceOf(Object);
    expect(res).toHaveProperty('name');
    expect(res.name).toBe('Accountancy');
  });
  it('should return a single object with libguides ["Accountancy"] for "ACC"', () => {
    expect(res).toBeInstanceOf(Object);
    expect(res).toHaveProperty('libguides');
    expect(res.libguides.length).toBe(1);
    expect(res.libguides).toEqual(['Accountancy']);
  });
  it('should return a single object with name "Academic Affairs" for "AA"', () => {
    expect(res2).toBeInstanceOf(Object);
    expect(res2).toHaveProperty('name');
    expect(res2.name).toBe('Academic Affairs');
  });
  it('should return a single object with libguides ["Educational Leadership"] for "AA"', () => {
    expect(res2).toBeInstanceOf(Object);
    expect(res2).toHaveProperty('libguides');
    expect(res2.libguides.length).toBe(1);
    expect(res2.libguides).toEqual(['Educational Leadership']);
  });
  it('should return false if two subjects share a regCode', () => {
    expect(badRes).toBe(false);
  });
});

describe('UserSubjectInfo: getRegCodeFromCourseNumber', () => {
  let reAlphaCodeFirst = /^([A-Z]+)/;
  let reUnorderedAlpha = /([A-Z]+)/;
  let reLowerCaseAlphaCode = /([a-z]+)/;
  it('should get "ACC" from "ACC123",/^([A-Z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('ACC123', reAlphaCodeFirst);
    expect(res).toBe('ACC');
  });
  it('should get false from "143sdalKA",/^([A-Z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('143sdalKA', reAlphaCodeFirst);
    expect(res).toBe(false);
  });
  it('should get "ACC" from "123ACC",/([A-Z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('ACC123', reUnorderedAlpha);
    expect(res).toBe('ACC');
  });
  it('should get "KA" from "143sdalKA",/([A-Z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('143sdalKA', reUnorderedAlpha);
    expect(res).toBe('KA');
  });
  it('should get "acc" from "acc123",/([a-z])+/', () => {
    let res = obj.getRegCodeFromCourseNumber('acc123', reLowerCaseAlphaCode);
    expect(res).toBe('acc');
  });
  // the ([A-Z]+)\d+ pattern should be assumed if no pattern specified
  it('should get "ACC" from "ACC123" with no pattern specified', () => {
    let res = obj.getRegCodeFromCourseNumber('ACC123');
    expect(res).toBe('ACC');
  });
  it('should get false from "143sdalKA" with no pattern specified', () => {
    let res = obj.getRegCodeFromCourseNumber('143sdalKA');
    expect(res).toBe(false);
  });
});

describe('UserSubjectInfo: addSubjectsFromCourses', () => {
  // this should get some stub tests
});

/* testing majorCode methods */

describe('UserSubjectInfo: getSubjByMajorCode', () => {
  let res = obj.getSubjByMajorCode('BU01');
  let res2 = obj.getSubjByMajorCode('EA18');

  it('should return a single object with name "Accountancy" for "BU01"', () => {
    expect(res).toBeInstanceOf(Object);
    expect(res).toHaveProperty('name');
    expect(res.name).toBe('Accountancy');
  });
  it('should return a single object with libguides ["Accountancy"] for "BU01"', () => {
    expect(res).toBeInstanceOf(Object);
    expect(res).toHaveProperty('libguides');
    expect(res.libguides.length).toBe(1);
    expect(res.libguides).toEqual(['Accountancy']);
  });
  it('should return a single object with name "Adolescent Education" for "EA18"', () => {
    expect(res2).toBeInstanceOf(Object);
    expect(res2).toHaveProperty('name');
    expect(res2.name).toBe('Adolescent Education');
  });
  it('should return a single object with libguides ["Education"] for "EA18"', () => {
    expect(res2).toBeInstanceOf(Object);
    expect(res2).toHaveProperty('libguides');
    expect(res2.libguides.length).toBe(1);
    expect(res2.libguides).toEqual(['Education']);
  });
});

/* testing deptCode methods */

describe('UserSubjectInfo: getSubjByDeptCode', () => {
  let res = obj.getSubjByDeptCode('ece');
  let res2 = obj.getSubjByDeptCode('ulb');

  it('should return a single object with name "Electrical and Computer Engineering" for "ece"', () => {
    expect(res).toBeInstanceOf(Object);
    expect(res).toHaveProperty('name');
    expect(res.name).toBe('Electrical and Computer Engineering');
  });
  it('should return a single object with name "Library" for "ulb"', () => {
    expect(res2).toBeInstanceOf(Object);
    expect(res2).toHaveProperty('name');
    expect(res2.name).toBe('Library');
  });
});
