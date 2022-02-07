const subjectAudit = require('../../../models/dataAudit/subjectAudit');
const rootpath = require('app-root-path');
const goodDataPath =
  rootpath + '/models/dataAudit/test/sample-data/goodData.json';
const badJsonPath =
  rootpath + '/models/dataAudit/test/sample-data/badJson.json';
const badDupDataPath =
  rootpath + '/models/dataAudit/test/sample-data/badDupCodes.json';

describe('subjectAudit: constructor', () => {
  it('should get data from the file passed on initialization', () => {
    const subjectAuditInstance = new subjectAudit(goodDataPath);
    expect(subjectAuditInstance.filepath).toEqual(goodDataPath);
  });
});

describe('subjectAudit: loadData', () => {
  it('should return true if the data is valid', () => {
    const subjectAuditInstance = new subjectAudit(goodDataPath);
    let validity = subjectAuditInstance.loadData();
    expect(validity.valid).toBe(true);
  });
  it('should return false with message if data is bad', () => {
    const subjectAuditInstance = new subjectAudit(badJsonPath);
    let validity = subjectAuditInstance.loadData();
    expect(validity.valid).toBe(false);
    expect(validity.errorMessage).toBe(
      'Unexpected token , in JSON at position 123'
    );
  });
});

describe('subjectAudit: getAllCodesOfType', () => {
  it('should return an array of all the regCodes of a given type', () => {
    const subjectAuditInstance = new subjectAudit(goodDataPath);
    subjectAuditInstance.loadData();
    let allCodesOfType = subjectAuditInstance.getAllCodesOfType('regCode');
    expect(allCodesOfType).toEqual(['AA', 'ACC']);
  });
  it('should return an array of all the deptCodes of a given type', () => {
    const subjectAuditInstance = new subjectAudit(goodDataPath);
    subjectAuditInstance.loadData();
    let allCodesOfType = subjectAuditInstance.getAllCodesOfType('deptCode');
    expect(allCodesOfType).toEqual(['acc', 'hac', 'mac', 'acp', 'had', 'maf']);
  });
  it('should return an array of all the majorCodes of a given type', () => {
    const subjectAuditInstance = new subjectAudit(goodDataPath);
    subjectAuditInstance.loadData();
    let allCodesOfType = subjectAuditInstance.getAllCodesOfType('majorCode');
    expect(allCodesOfType).toEqual(['BU01', 'BUKA', 'RCKA', 'BU8C', 'EA18']);
  });
  it('should return an array of all the regCodes of a given type even with dups', () => {
    const subjectAuditInstance = new subjectAudit(badDupDataPath);
    subjectAuditInstance.loadData();
    let allCodesOfType = subjectAuditInstance.getAllCodesOfType('regCode');
    expect(allCodesOfType).toEqual(['AA', 'ACC', 'ACC']);
  });
  it('should return an array of all the deptCodes of a given type', () => {
    const subjectAuditInstance = new subjectAudit(badDupDataPath);
    subjectAuditInstance.loadData();
    let allCodesOfType = subjectAuditInstance.getAllCodesOfType('deptCode');
    expect(allCodesOfType).toEqual([
      'acc',
      'acc',
      'hac',
      'mac',
      'acp',
      'had',
      'maf',
    ]);
  });
  it('should return an array of all the majorCodes of a given type', () => {
    const subjectAuditInstance = new subjectAudit(badDupDataPath);
    subjectAuditInstance.loadData();
    let allCodesOfType = subjectAuditInstance.getAllCodesOfType('majorCode');
    expect(allCodesOfType).toEqual([
      'BU01',
      'BU01',
      'BUKA',
      'RCKA',
      'BU8C',
      'EA18',
    ]);
  });
});

describe('subjectAudit: checkForDuplicateCodes', () => {
  it('should return true if there are no duplicate codes', () => {
    const subjectAuditInstance = new subjectAudit(goodDataPath);
    subjectAuditInstance.loadData();
    let response = subjectAuditInstance.checkForDuplicateCodes();
    expect(response.valid).toBe(true);
  });
  it('should return false if there are duplicate codes', () => {
    const subjectAuditInstance = new subjectAudit(badDupDataPath);
    subjectAuditInstance.loadData();
    let response = subjectAuditInstance.checkForDuplicateCodes();
    expect(response.valid).toBe(false);
    expect(response.errorMessage).toBe('Duplicate codes found');
    expect(response.duplicateCodes).toEqual({
      regCodes: ['ACC', 'ACC'],
      deptCodes: ['acc', 'acc'],
      majorCodes: ['BU01', 'BU01'],
    });
  });
});

describe('subjectAudit: listUniqueLibguides', () => {
  it('should find 3 distinct libguides in goodData', () => {
    const subjectAuditInstance = new subjectAudit(goodDataPath);
    subjectAuditInstance.loadData();
    let response = subjectAuditInstance.listUniqueLibguides();
    expect(response).toEqual([
      'Accountancy',
      'Education',
      'Educational Leadership',
    ]);
  });
});
