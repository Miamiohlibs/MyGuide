const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const chaiArrays = require('chai-arrays');
chai.use(chaiArrays);
const UserSubjectInfo = require('../../repositories/UserSubjectInfo');

const userData1 = require('./sample-data/loggedInData1.json');
const subjectMap1 = require('./sample-data/subjectMapMiami.json');

describe('UserSubjectInfo: constructor', () => {
  let obj = new UserSubjectInfo(userData1, subjectMap1);
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
