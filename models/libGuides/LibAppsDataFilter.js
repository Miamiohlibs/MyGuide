// const subjects = require('../cache/Subjects');
// I think this is old news -- delete?

module.exports = class LibAppsDataFilter {
  // constructor() {}
  setDatabases(dbs) {
    this.databases = dbs;
  }

  safeFilename(str) {
    return str.replace(/[\W_]+/g, '');
  }

  removeUnpublishedGuides(list) {
    return list.filter((item) => item.status_label == 'Published');
  }

  removeWrongGroups(list, allowed) {
    return list.filter((item) => allowed.includes(item.group_id));
  }

  mapTags(list) {
    /* gets Map() of guides by tag name
     * where tag name follows "ENG101", "MGMT123" pattern
     * pattern allows start with 2-5 letters, maybespace, 2-5 digits, openended end (ENG101-Anderson)
     * lists all guides for a particular tag
     */
    let tagMap = new Map();
    let taggedGds = list.filter((i) => i.hasOwnProperty('tags'));

    taggedGds.map((g) => {
      g.tags.forEach((t) => {
        // limit to tags structured like course numbers ABC123, space optional in the middle
        let re = /^[A-Z]{2,5} *[0-9]{2,5}/;
        if (t.text.match(re)) {
          let key = t.text;
          if (tagMap.has(key)) {
            let arr = tagMap.get(key);
            arr.push(g);
            tagMap.set(key, arr);
          } else {
            tagMap.set(key, [g]); // add guide to map
          }
        }
      });
    });
    return tagMap;
  }

  findByTag(list, searchTags, inverse = false) {
    //when inverse = true, return items WITHOUT the specified tag
    if (!Array.isArray(searchTags)) {
      searchTags = [searchTags];
    }
    // console.log('length:', list.length);
    // console.log('tags:', searchTags);
    return list.filter((item) => {
      if (!Array.isArray(item.tags)) {
        // if no tags, return false under normal conditions
        // return true if looking for non-matches (inverse)
        return inverse;
      } else {
        // if is array, check against the array
        let tagsArr = [];

        item.tags.forEach((entry) => tagsArr.push(entry.text, entry.id));
        // filteredArray = intersection of searchTags and found terms
        let filteredArray = searchTags.filter((value) =>
          tagsArr.includes(value)
        );

        if (filteredArray.length > 0) {
          return inverse ? false : true;
        } else {
          return inverse ? true : false;
        }
      }
    });
  }

  filterBySubject(resourceList, subject, topOnly = false) {
    var results = [];
    resourceList.forEach(function (item) {
      if (item.subjects !== undefined) {
        if (topOnly) {
          var temp = item.subjects.filter(
            (s) => s.name === subject && s.featured > 0
          );
        } else {
          var temp = item.subjects.filter((s) => s.name === subject);
        }
        if (item.subjects !== undefined) {
          if (temp.length > 0) {
            results.push(item);
          }
        }
      }
    });
    return results;
  }

  findSubjectByName(resourceList, subjectArr) {
    /* find the libguides subject entry by its name */
    let matches = [];
    subjectArr.forEach((subject) => {
      matches.push(resourceList.filter((x) => x.name == subject)[0]);
    });
    return matches;
  }

  getBestBySubject(resourceList, subjects, topOnly = false, dbSort = false) {
    // expects resourceList to be an object listing database, librarians, or libguides
    // expect subjects to be an array of subject areas in order of best fit, e.g.:
    // subjects = ['English','Languages']
    // if resources don't exist for English, return relevant resources for languages instead
    // we'll have to decide if that's really a good idea...

    // console.log(subjects)
    // console.log('LENGTH:', subjects.length)
    var found = false;
    for (var i = 0; i < subjects.length; i++) {
      if (found === false) {
        // console.log('checking', subjects[i])
        let response = this.filterBySubject(resourceList, subjects[i], topOnly);
        // console.log(response)
        if (response.length > 0) {
          var done = response;
          // console.log('Good answer:',done[0].email)
          found = true;
        }
      }
    }
    if (done === undefined) {
      return [];
    } else {
      if (dbSort) {
        done = this.sortDatabases(done, subjects);
      }
      return done;
    }
  }

  getSubjectsByExpertEmail(libns, email) {
    // when given a list of librarians and an email address
    // find the librarian with that email
    // and return a list of subjects in which they are the 'expert'
    let libn = libns.filter((item) => {
      if (item.email === email) {
        return true;
      }
      return false;
    });
    if (libn.length > 0 && libn[0].hasOwnProperty('subjects')) {
      return libn[0].subjects
        .map((item) => item.name)
        .filter((item) => item !== undefined);
    }
    return [];
  }

  addSubjectSortVariable(dbs, subjects) {
    // adds a "sortable" value on the database object equal to the featured value for the first subject
    // but changes 0 to 1000 so non-featured come last in the list
    return dbs.map((db) => {
      // console.log('db has subjects: ', db.hasOwnProperty('subjects'));
      // console.log('first subject name: ', db.subjects[0].name);
      // console.log(`looking for ${subjects[0]} among the subjects`);
      let relevantDbSubjectEntry = db.subjects?.find((subj) => {
        return subj.name == subjects[0];
      });
      if (relevantDbSubjectEntry?.featured == 0) {
        db.sortable = 1000;
      } else {
        db.sortable = relevantDbSubjectEntry?.featured;
      }
      return db;
    });
  }

  sortDatabases(dbs, subjects) {
    // for featured >0, sort by featured (numerical 1-infinity), then alpha by name
    // then do an alpha sort of featured == 0 and append to the end
    console.log('SortDBs: ' + subjects.join(';') + ': ' + dbs.length);
    const output = [];
    const sortable = this.addSubjectSortVariable(dbs, subjects);

    // for featured >0, sort by featured (numerical 1-infinity), then alpha by name
    sortable.sort((a, b) => {
      return a.sortable - b.sortable || a.name.localeCompare(b.name);
    });
    sortable.forEach((obj) => {
      delete obj.sortable;
    });
    output.push(sortable);
    // console.log(output);
    // // alpha sort of featured == 0
    // zeros.sort((a, b) => {
    //   return a.name.localeCompare(b.name);
    // });

    // // append zeros to output
    // output.push(zeros);
    return output.flat();
  }
};
