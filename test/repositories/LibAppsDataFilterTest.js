const chai = require('chai');
const assert = require('chai').assert;
const expect = require('chai').expect;
const should = require('chai').should;
const LibAppsDataFilter = require('../../repositories/LibAppsDataFilter.js');
const chaiArrays = require('chai-arrays');
chai.use(chaiArrays);

obj = new LibAppsDataFilter();

databases = require('./sample-data/libapps/db-sample');
librarians = require('./sample-data/libapps/libn-sample');
guides = require('./sample-data/libapps/guides-sample');
subjects = require('./sample-data/libapps/subj-sample');

describe('LibAppsDataFilter', () => {
  it('should return an object of class LibAppsDataFilter', () => {
    assert.isTrue(obj instanceof LibAppsDataFilter);
  });
});

describe('LibAppsDataFilter: databases', () => {
  it('should have an array in the databases property', () => {
    expect(databases).to.be.an.array();
  });
  it('should have the first database with name: "19th Century Index"', () => {
    expect(databases[0]).to.have.property('name');
    expect(databases[0].name).to.equal('19th Century Index');
  });
  it('should find five databases', () => {
    expect(databases.length).to.equal(5);
  });
});

describe('LibAppsDataFilter: filterBySubject: Databases', () => {
  english = obj.filterBySubject(databases, 'English'); // 5
  topEnglish = obj.filterBySubject(databases, 'English', true); // 1
  bws = obj.filterBySubject(databases, 'Black World Studies'); // 2

  it('should find five English databases', () => {
    expect(english.length).to.equal(5);
  });
  it('should find two BWS databases', () => {
    expect(bws.length).to.equal(2);
  });
  it('should fine one top English database', () => {
    expect(topEnglish.length).to.equal(1);
    expect(topEnglish[0].name).to.equal('19th Century Index');
  });
});

describe('LibAppsDataFilter: librarians', () => {
  it('should have an array in the librarians property', () => {
    expect(librarians).to.be.an.array();
  });
  it('should have the first librarian with last name: "Picard"', () => {
    expect(librarians[0]).to.have.property('last_name');
    expect(librarians[0].last_name).to.equal('Picard');
  });
  it('should find three librarians', () => {
    expect(librarians.length).to.equal(3);
  });
});

describe('LibAppsDataFilter: filterBySubject: librarians', () => {
  bizLib = obj.filterBySubject(librarians, 'Business'); // susan
  langLib = obj.filterBySubject(librarians, 'Languages'); // katie

  it('should find one language librarian = Sisko', () => {
    expect(langLib.length).to.equal(1);
    expect(langLib[0].last_name).to.equal('Sisko');
  });
  it('should find one business librarian = Janeway', () => {
    expect(bizLib.length).to.equal(1);
    expect(bizLib[0].last_name).to.equal('Janeway');
  });
});

describe('LibAppsDataFilter: guides', () => {
  it('should have an array in the guides property', () => {
    expect(guides).to.be.an.array();
  });
  it('should have the first guide with name: "Political Science"', () => {
    expect(guides[0]).to.have.property('name');
    expect(guides[0].name).to.equal('Political Science');
  });
  it('should find nine guides', () => {
    expect(guides.length).to.equal(9);
  });
});

describe('LibAppsDataFilter: removeUnpublishedGuides', () => {
  publishedOnly = obj.removeUnpublishedGuides(guides); //5
  it('should find seven published guides', () => {
    expect(publishedOnly.length).to.equal(7);
  });
});

describe('LibAppsDataFilter: removeWrongGroups', () => {
  let allowedGroupsRestricted = ['0'];
  let allowedGroupsPermissive = ['0', '16880'];
  let allowedGroupsModerate = ['0', '12345'];
  it('should find eight members of group zero', () => {
    let result = obj.removeWrongGroups(guides, allowedGroupsRestricted);
    expect(result.length).to.equal(8);
  });
  it('should find nine members of groups 0+16880', () => {
    let result = obj.removeWrongGroups(guides, allowedGroupsPermissive);
    expect(result.length).to.equal(9);
  });
  it('should find eight members of groups 0+12345', () => {
    let result = obj.removeWrongGroups(guides, allowedGroupsModerate);
    expect(result.length).to.equal(8);
  });
});

describe('LibAppsDataFilter: filterBySubject: guides', () => {
  polGuides = obj.filterBySubject(guides, 'Political Science'); // 2
  chemGuides = obj.filterBySubject(guides, 'Chemistry & Biochemistry'); // 1
  // psychGuides = obj.filterBySubject(guides, 'Psychology'); // 1
  it('should find one Chemistry guide', () => {
    expect(chemGuides.length).to.equal(1);
  });

  it('should find two PoliSci guide', () => {
    expect(polGuides.length).to.equal(2);
  });

  // it('should find one Psychology guide (none unpublished)', () => {
  //   expect(psychGuides.length).to.equal(1);
  // });
});

describe('LibAppsDataFilter: find (LibGuides) Subject by Name', () => {
  englishSubj = obj.findSubjectByName(subjects, ['English']);
  it('should find one libguide subject: English = 8447', () => {
    expect(englishSubj.length).to.equal(1);
    expect(englishSubj[0].id).to.equal('8447');
  });
  musicEdSubj = obj.findSubjectByName(subjects, ['Music', 'Education']);
  it('should find two subjects for Music Education', () => {
    expect(musicEdSubj.length).to.equal(2);
    expect(musicEdSubj[0].id).to.equal('8429');
    expect(musicEdSubj[1].id).to.equal('4596');
  });
});

describe('LibAppsDataFilter: findByTag', () => {
  taggedACC = obj.findByTag(guides, 'ACC495');
  taggedACCinv = obj.findByTag(guides, 'ACC495', true);
  taggedArr = obj.findByTag(guides, ['ACC495', 'ENG121']);
  taggedArrInv = obj.findByTag(guides, ['ACC495', 'ENG121'], true);
  taggedACCbyID = obj.findByTag(guides, '682640');
  taggedACCbyIDinv = obj.findByTag(guides, '682640', true);
  taggedEitherByID = obj.findByTag(guides, ['682640', '15716']);
  taggedEitherByIDinv = obj.findByTag(guides, ['682640', '15716'], true);

  it('should find two libguides with tag ACC495', () => {
    expect(taggedACC.length).to.equal(2);
    expect(taggedACC[0].id).to.equal('22054');
  });
  it('should find seven libguides WITHOUT tag ACC495', () => {
    expect(taggedACCinv.length).to.equal(7);
  });

  it('should find two libguides with tag 695364', () => {
    expect(taggedACCbyID.length).to.equal(2);
    expect(taggedACCbyID[0].id).to.equal('22054');
  });
  it('should find seven libguides WITHOUT tag 695364', () => {
    expect(taggedACCbyIDinv.length).to.equal(7);
  });

  it('should find one libguide with tag in [695364,ENG121]', () => {
    expect(taggedArr.length).to.equal(2);
    expect(taggedArr[0].id).to.equal('22054');
  });
  it('should find eight libguides WITHOUT tag in [695364,ENG121]', () => {
    expect(taggedArrInv.length).to.equal(7);
  });

  it('should find three libguide with tag in [ACC495,15716]', () => {
    expect(taggedEitherByID.length).to.equal(3);
    expect(taggedEitherByID[0].id).to.equal('22054');
  });
  it('should find eight libguides WITHOUT tag in [695364,15716]', () => {
    expect(taggedEitherByIDinv.length).to.equal(6);
  });

  /*
  It should be able to handle: 
    * a string
    * an array
    * match on tag.text 
    * match on tag.id
  */
});

describe('LibAppsDataFilter: mapTags', () => {
  let tagMap = obj.mapTags(guides);

  it('should return a Map object', () => {
    assert.isTrue(tagMap instanceof Map);
  });

  it('should have a size of two tags', () => {
    expect(tagMap.size).to.equal(2);
  });

  it('the value for ACC495 should be an array with two objects', () => {
    let acc = tagMap.get('ACC495');
    expect(acc).to.be.an.array();
    expect(acc.length).to.equal(2);
    expect(acc[0].id).to.equal('22054');
  });

  it('the value for ENG 101 should be an array with one object', () => {
    let eng = tagMap.get('ENG101');
    expect(eng).to.be.an.array();
    expect(eng.length).to.equal(1);
    expect(eng[0].id).to.equal('22054');
  });
});
// WE SHOULD HAVE A UNIT TESTS FOR getBestBySubject -- needs some stubs or fakes and I don't want to learn how!!!!!

// describe('getBestBySubject', () => {
//   it('should return results for the first subject when there are results for it', () => {
//     let subjOrder = ['English','Languages'];

//   })
// })
