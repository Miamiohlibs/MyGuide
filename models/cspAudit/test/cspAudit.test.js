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

describe('cspAudit: extractUrls', () => {
  it('should return an array of all the urls from a string', () => {
    const data = 'http://example.com, bobs your uncle https://example.net/blog';
    const csp = new CspAudit(data);
    let urls = csp.extractUrls(data);
    expect(urls).toEqual(['example.com', 'example.net/blog']);
  });
  it('should return an array of all the urls from an array', () => {
    const data = [
      'http://example.com, bobs',
      'your uncle https://example.net/blog',
    ];
    const csp = new CspAudit();
    let urls = csp.extractUrls(data);
    expect(urls).toEqual(['example.com', 'example.net/blog']);
  });
  it('should find urls with http, https, ftp, or no protocol', () => {
    const data =
      'http://example.com, https://example.net, ftp://example.org, //example.co.uk';
    const csp = new CspAudit();
    let urls = csp.extractUrls(data);
    expect(urls).toEqual([
      'example.com',
      'example.net',
      'example.org',
      'example.co.uk',
    ]);
  });
  it('should find urls of many lengths', () => {
    const data =
      'http://deep.organization.example.com, https://example.net, ftp://example.org, //example.co.uk, http://example.com/longer/path, https://example.net/longer/path, ftp://example.org/longer/path, //example.co.uk/longer/path.jpg';
    const csp = new CspAudit();
    let urls = csp.extractUrls(data);
    expect(urls).toEqual([
      'deep.organization.example.com',
      'example.net',
      'example.org',
      'example.co.uk',
      'example.com/longer/path',
      'example.net/longer/path',
      'example.org/longer/path',
      'example.co.uk/longer/path.jpg',
    ]);
  });
});
