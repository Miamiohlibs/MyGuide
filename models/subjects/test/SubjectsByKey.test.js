const config = require('./sample-data/sample-subjects-config.json');
const SubjectsByKey = require('../SubjectsByKey');
// const Subjects = require(approot + '/config/' + subjFile);

describe('SubjectsByKey', () => {
  it('should return an object of class SubjectsByKey', () => {
    expect(new SubjectsByKey() instanceof SubjectsByKey).toBe(true);
  });
  it('should take a config object', () => {
    const subjectsByKey = new SubjectsByKey(config);
    expect(subjectsByKey).toHaveProperty('subjects');
    expect(subjectsByKey.subjects).toBeInstanceOf(Array);
    expect(subjectsByKey.subjects.length).toBe(9);
  });
  it('should have the first subject with name: "Accountancy"', () => {
    const subjectsByKey = new SubjectsByKey(config);
    expect(subjectsByKey.subjects[0]).toHaveProperty('name');
    expect(subjectsByKey.subjects[0].name).toBe('Accountancy');
  });
  it('should return an empty array if no configFile sent', () => {
    const subjectsByKey = new SubjectsByKey();
    expect(subjectsByKey.subjects).toBeInstanceOf(Array);
    expect(subjectsByKey.subjects.length).toBe(0);
  });
});

describe('SubjectsByKey: getSubjectsData', () => {
  it('should return an array of subjects', () => {
    const subjectsByKey = new SubjectsByKey(config);
    expect(subjectsByKey.getSubjectsData()).toBeInstanceOf(Array);
    expect(subjectsByKey.getSubjectsData().length).toBe(9);
  });
});

describe('SubjectsByKey: getSubjectByRegCode', () => {
  it('should return an object with regCode: "ACC"', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByRegCode('ACC');
    expect(subject).toHaveProperty('name');
    expect(subject.name).toBe('Accountancy');
    expect(subject).toHaveProperty('regCodes');
    expect(subject.regCodes).toBeInstanceOf(Array);
    expect(subject.regCodes.length).toBe(1);
    expect(subject.regCodes[0]).toHaveProperty('regCode');
    expect(subject.regCodes[0].regCode).toBe('ACC');
  });
  it('should return an object with regCode: "acc" despite case difference', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByRegCode('acc');
    expect(subject).toHaveProperty('name');
    expect(subject.name).toBe('Accountancy');
    expect(subject).toHaveProperty('regCodes');
    expect(subject.regCodes).toBeInstanceOf(Array);
    expect(subject.regCodes.length).toBe(1);
    expect(subject.regCodes[0]).toHaveProperty('regCode');
    expect(subject.regCodes[0].regCode).toBe('ACC');
  });
  it('should return an empty object if regCode not found', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByRegCode('ZZZ');
    expect(subject).toEqual({});
  });
  it('should return an empty object if no regCode sent', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByRegCode();
    expect(subject).toEqual({});
  });
});

describe('SubjectsByKey: getSubjectByMajorCode', () => {
  it('should return an object with majorCode: "BU01"', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByMajorCode('BU01');
    expect(subject).toHaveProperty('name');
    expect(subject.name).toBe('Accountancy');
    expect(subject).toHaveProperty('majorCodes');
    expect(subject.majorCodes).toBeInstanceOf(Array);
    expect(subject.majorCodes.length).toBe(1);
    expect(subject.majorCodes[0]).toHaveProperty('majorCode');
    expect(subject.majorCodes[0].majorCode).toBe('BU01');
  });
  it('should return an object with majorCode: "bu01" despite case difference', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByMajorCode('bu01');
    expect(subject).toHaveProperty('name');
    expect(subject.name).toBe('Accountancy');
    expect(subject).toHaveProperty('majorCodes');
    expect(subject.majorCodes).toBeInstanceOf(Array);
    expect(subject.majorCodes.length).toBe(1);
    expect(subject.majorCodes[0]).toHaveProperty('majorCode');
    expect(subject.majorCodes[0].majorCode).toBe('BU01');
  });
  it('should return an empty object if majorCode not found', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByMajorCode('ZZZ');
    expect(subject).toEqual({});
  });
  it('should return an empty object if no majorCode sent', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByMajorCode();
    expect(subject).toEqual({});
  });
});

describe('SubjectsByKey: getSubjectByDeptCode', () => {
  it('should return an object with deptCode: "caw"', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByDeptCode('caw');
    expect(subject).toHaveProperty('name');
    expect(subject.name).toBe('American & World Cultures');
    expect(subject).toHaveProperty('deptCodes');
    expect(subject.deptCodes).toBeInstanceOf(Array);
    expect(subject.deptCodes.length).toBe(1);
    expect(subject.deptCodes[0]).toHaveProperty('deptCode');
    expect(subject.deptCodes[0].deptCode).toBe('caw');
  });
  it('should return an object with deptCode: "CAW" despite case difference', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByDeptCode('CAW');
    expect(subject).toHaveProperty('name');
    expect(subject.name).toBe('American & World Cultures');
    expect(subject).toHaveProperty('deptCodes');
    expect(subject.deptCodes).toBeInstanceOf(Array);
    expect(subject.deptCodes.length).toBe(1);
    expect(subject.deptCodes[0]).toHaveProperty('deptCode');
    expect(subject.deptCodes[0].deptCode).toBe('caw');
  });
  it('should return an empty object if deptCode not found', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByDeptCode('ZZZ');
    expect(subject).toEqual({});
  });
  it('should return an empty object if no deptCode sent', () => {
    const subjectsByKey = new SubjectsByKey(config);
    const subject = subjectsByKey.getSubjectByDeptCode();
    expect(subject).toEqual({});
  });
});
