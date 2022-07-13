const Usage = require('../models/usageLog/Usage');
const usage = new Usage();
const { getOpts, applyDataLimiters } = require('./dataAnalysisHelpers');

getSubjectStats = function (data, userOptions) {
  // userOptions include:
  // * population: student, faculty, staff; defaults to all
  // * startDate: defaults to start of logs
  // * endDate: defaults to today

  // Future dev:
  // * subjectType: major, course, department; defaults to all

  userOpts = getOpts(data, userOptions);
  data = applyDataLimiters(data, userOpts);
  //   return data;
  let subjField = getSubjField(userOpts.subjectType);

  let allSubjects = [];
  data.forEach((el) => {
    allSubjects = allSubjects.concat(el[subjField]);
  });
  //   return allSubjects;
  // count frequency of subjects in allSubjects
  let subjectCounts = {};
  allSubjects.forEach((el) => {
    if (subjectCounts[el]) {
      subjectCounts[el]++;
    } else {
      subjectCounts[el] = 1;
    }
  });

  return { options: userOpts, subjectCounts };
};

getSubjField = function (subjectType) {
  switch (userOpts.subjectType) {
    case 'major': {
      return 'majors';
      break;
    }
    case 'course': {
      return 'courseDepts';
      break;
    }
    case 'department': {
      return 'departments';
      break;
    }
    default: {
      return 'subjects';
    }
  }
};

module.exports = getSubjectStats;
