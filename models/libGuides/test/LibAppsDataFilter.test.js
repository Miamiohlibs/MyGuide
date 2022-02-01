const LibAppsDataFilter = require('../LibAppsDataFilter.js');

obj = new LibAppsDataFilter();

databases = require('./sample-data/libapps/db-sample');
librarians = require('./sample-data/libapps/libn-sample');
guides = require('./sample-data/libapps/guides-sample');
subjects = require('./sample-data/libapps/subj-sample');

describe('LibAppsDataFilter', () => {
  it('should return an object of class LibAppsDataFilter', () => {
    expect(obj instanceof LibAppsDataFilter).toBe(true);
  });
});

describe('LibAppsDataFilter: databases', () => {
  it('should have an array in the databases property', () => {
    expect(Array.isArray(databases)).toBe(true);
  });
  it('should have the first database with name: "19th Century Index"', () => {
    expect(databases[0]).toHaveProperty('name');
    expect(databases[0].name).toBe('19th Century Index');
  });
  it('should find five databases', () => {
    expect(databases.length).toBe(5);
  });
});

describe('LibAppsDataFilter: filterBySubject: Databases', () => {
  english = obj.filterBySubject(databases, 'English'); // 5
  topEnglish = obj.filterBySubject(databases, 'English', true); // 1
  bws = obj.filterBySubject(databases, 'Black World Studies'); // 2

  it('should find five English databases', () => {
    expect(english.length).toBe(5);
  });
  it('should find two BWS databases', () => {
    expect(bws.length).toBe(2);
  });
  it('should fine one top English database', () => {
    expect(topEnglish.length).toBe(1);
    expect(topEnglish[0].name).toBe('19th Century Index');
  });
});

describe('LibAppsDataFilter: librarians', () => {
  it('should have an array in the librarians property', () => {
    expect(Array.isArray(librarians)).toBe(true);
  });
  it('should have the first librarian with last name: "Picard"', () => {
    expect(librarians[0]).toHaveProperty('last_name');
    expect(librarians[0].last_name).toBe('Picard');
  });
  it('should find three librarians', () => {
    expect(librarians.length).toBe(3);
  });
});

describe('LibAppsDataFilter: filterBySubject: librarians', () => {
  bizLib = obj.filterBySubject(librarians, 'Business'); // susan
  langLib = obj.filterBySubject(librarians, 'Languages'); // katie

  it('should find one language librarian = Sisko', () => {
    expect(langLib.length).toBe(1);
    expect(langLib[0].last_name).toBe('Sisko');
  });
  it('should find one business librarian = Janeway', () => {
    expect(bizLib.length).toBe(1);
    expect(bizLib[0].last_name).toBe('Janeway');
  });
});

describe('LibAppsDataFilter: guides', () => {
  it('should have an array in the guides property', () => {
    expect(Array.isArray(guides)).toBe(true);
  });
  it('should have the first guide with name: "Political Science"', () => {
    expect(guides[0]).toHaveProperty('name');
    expect(guides[0].name).toBe('Political Science');
  });
  it('should find nine guides', () => {
    expect(guides.length).toBe(9);
  });
});

describe('LibAppsDataFilter: removeUnpublishedGuides', () => {
  publishedOnly = obj.removeUnpublishedGuides(guides); //5
  it('should find seven published guides', () => {
    expect(publishedOnly.length).toBe(7);
  });
});

describe('LibAppsDataFilter: removeWrongGroups', () => {
  let allowedGroupsRestricted = ['0'];
  let allowedGroupsPermissive = ['0', '16880'];
  let allowedGroupsModerate = ['0', '12345'];
  it('should find eight members of group zero', () => {
    let result = obj.removeWrongGroups(guides, allowedGroupsRestricted);
    expect(result.length).toBe(8);
  });
  it('should find nine members of groups 0+16880', () => {
    let result = obj.removeWrongGroups(guides, allowedGroupsPermissive);
    expect(result.length).toBe(9);
  });
  it('should find eight members of groups 0+12345', () => {
    let result = obj.removeWrongGroups(guides, allowedGroupsModerate);
    expect(result.length).toBe(8);
  });
});

describe('LibAppsDataFilter: filterBySubject: guides', () => {
  polGuides = obj.filterBySubject(guides, 'Political Science'); // 2
  chemGuides = obj.filterBySubject(guides, 'Chemistry & Biochemistry'); // 1
  // psychGuides = obj.filterBySubject(guides, 'Psychology'); // 1
  it('should find one Chemistry guide', () => {
    expect(chemGuides.length).toBe(1);
  });

  it('should find two PoliSci guide', () => {
    expect(polGuides.length).toBe(2);
  });

  // it('should find one Psychology guide (none unpublished)', () => {
  //   expect(psychGuides.length).to.equal(1);
  // });
});

describe('LibAppsDataFilter: find (LibGuides) Subject by Name', () => {
  englishSubj = obj.findSubjectByName(subjects, ['English']);
  it('should find one libguide subject: English = 8447', () => {
    expect(englishSubj.length).toBe(1);
    expect(englishSubj[0].id).toBe('8447');
  });
  musicEdSubj = obj.findSubjectByName(subjects, ['Music', 'Education']);
  it('should find two subjects for Music Education', () => {
    expect(musicEdSubj.length).toBe(2);
    expect(musicEdSubj[0].id).toBe('8429');
    expect(musicEdSubj[1].id).toBe('4596');
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
    expect(taggedACC.length).toBe(2);
    expect(taggedACC[0].id).toBe('22054');
  });
  it('should find seven libguides WITHOUT tag ACC495', () => {
    expect(taggedACCinv.length).toBe(7);
  });

  it('should find two libguides with tag 695364', () => {
    expect(taggedACCbyID.length).toBe(2);
    expect(taggedACCbyID[0].id).toBe('22054');
  });
  it('should find seven libguides WITHOUT tag 695364', () => {
    expect(taggedACCbyIDinv.length).toBe(7);
  });

  it('should find one libguide with tag in [695364,ENG121]', () => {
    expect(taggedArr.length).toBe(2);
    expect(taggedArr[0].id).toBe('22054');
  });
  it('should find eight libguides WITHOUT tag in [695364,ENG121]', () => {
    expect(taggedArrInv.length).toBe(7);
  });

  it('should find three libguide with tag in [ACC495,15716]', () => {
    expect(taggedEitherByID.length).toBe(3);
    expect(taggedEitherByID[0].id).toBe('22054');
  });
  it('should find eight libguides WITHOUT tag in [695364,15716]', () => {
    expect(taggedEitherByIDinv.length).toBe(6);
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
    expect(tagMap instanceof Map).toBe(true);
  });

  it('should have a size of two tags', () => {
    expect(tagMap.size).toBe(2);
  });

  it('the value for ACC495 should be an array with two objects', () => {
    let acc = tagMap.get('ACC495');
    expect(Array.isArray(acc)).toBe(true);
    expect(acc.length).toBe(2);
    expect(acc[0].id).toBe('22054');
  });

  it('the value for ENG 101 should be an array with one object', () => {
    let eng = tagMap.get('ENG101');
    expect(Array.isArray(eng)).toBe(true);
    expect(eng.length).toBe(1);
    expect(eng[0].id).toBe('22054');
  });
});

describe('LibAppsDataFilter: getSubjectsByExpertEmail', () => {
  it('should find two subjects for picardjl@fake.edu', () => {
    let subjects = obj.getSubjectsByExpertEmail(
      librarians,
      'picardjl@fake.edu'
    );
    let expected = ['Family Science and Social Work', 'Social Work'];
    expect(subjects.length).toBe(2);
    expect(subjects[0]).toBe(expected[0]);
    expect(subjects[1]).toBe(expected[1]);
  });
  it('should find six subjects for janewak@fake.edu', () => {
    let subjects = obj.getSubjectsByExpertEmail(librarians, 'janewak@fake.edu');
    let expected = [
      'Accountancy',
      'Business',
      'Entrepreneurship',
      'Finance',
      'Management',
      'Marketing',
    ];
    expect(subjects.length).toBe(6);
    expect(subjects[0]).toBe(expected[0]);
    expect(subjects[1]).toBe(expected[1]);
    expect(subjects[5]).toBe(expected[5]);
  });
  it('should get a blank array for a non-existent email', () => {
    let subjects = obj.getSubjectsByExpertEmail(librarians, 'q@continuum.net');
    expect(Array.isArray(subjects)).toBe(true);
    expect(subjects.length).toBe(0);
  });
});

// WE SHOULD HAVE A UNIT TESTS FOR getBestBySubject -- needs some stubs or fakes and I don't want to learn how!!!!!

// describe('getBestBySubject', () => {
//   it('should return results for the first subject when there are results for it', () => {
//     let subjOrder = ['English','Languages'];

//   })
// })
