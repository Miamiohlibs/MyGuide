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
    if (typeof searchTags === 'string' || searchTags instanceof String) {
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
            (s) => s.name === subject && s.featured === '1'
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

  getBestBySubject(resourceList, subjects, topOnly = false) {
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
      return done;
    }
  }
};
