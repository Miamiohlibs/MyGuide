const rootpath = require('app-root-path');
const testData = require('./sample-data/Librarians-test');
const limitedSampleData = require('./sample-data/Librarians-limited');
const CspAudit = require(rootpath + '/models/cspAudit/cspAudit');
const realRelevantFields = [
  'profile.image.url',
  'profile.widget_la',
  'profile.widget_lc',
  'profile.widget_other',
];

describe('subjectAudit: constructor', () => {
  it('should load the data passed to it', () => {
    const csp = new CspAudit(testData);
    expect(csp.data).toEqual(testData);
  });
  it('it should have no relevantFields by default', () => {
    const csp = new CspAudit(testData);
    expect(csp.relevantFields).toEqual([]);
  });
});

describe('cspAudit: limitToRelevantFields', () => {
  it('should hande a simple limit to relevant fields', () => {
    const data = [{ a: 1, b: 2, c: 3 }];
    const relevantFields = ['a', 'c'];
    const csp = new CspAudit(data, relevantFields);
    let limitedData = csp.limitToRelevantFields();
    expect(limitedData).toEqual([[1, 3]]);
  });
  it('should hande a simple limit to relevant fields with multiple entries', () => {
    const data = [
      { a: 1, b: 2, c: 3 },
      { a: 10, b: 20, c: 30 },
    ];
    const relevantFields = ['a', 'c'];
    const csp = new CspAudit(data, relevantFields);
    let limitedData = csp.limitToRelevantFields();
    expect(limitedData).toEqual([
      [1, 3],
      [10, 30],
    ]);
  });
  it('should handle a complex limit to relevant fields', () => {
    const data = [{ profile: { image: { value: 1 } } }];
    const relevantFields = ['profile.image.value'];
    const csp = new CspAudit(data, relevantFields);
    let limitedData = csp.limitToRelevantFields();
    expect(limitedData).toEqual([[1]]);
  });
  it('should return an array of objects with only the relevant fields', () => {
    const csp = new CspAudit(testData, realRelevantFields);
    let limitedData = csp.limitToRelevantFields();
    expect(limitedData).toEqual(limitedSampleData);
  });
  it('should be able to handle objects with missing fields', () => {
    const data = [{ a: 1, b: 2, c: 3 }];
    const relevantFields = ['a', 'c', 'd'];
    const csp = new CspAudit(data, relevantFields);
    let limitedData = csp.limitToRelevantFields();
    expect(limitedData).toEqual([[1, 3, undefined]]);
  });
});

// describe('cspAudit: extractUrls', () => {
//     it('should return an array of all the urls in the data', () => {
//         const csp = new CspAudit(testData);
//         let urls = csp.extractUrls();
//         expect(urls).toEqual([
//         ]);
// });
