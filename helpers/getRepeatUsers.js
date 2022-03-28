const Usage = require('../models/usageLog/Usage');
const usage = new Usage();
const dayjs = require('dayjs');

// const getData = require('./scripts/getUsageData');
// data = getData();
// data = usage.filterDataByUsertype(data, 'student');

getRepeatUsers = function (data, options) {
  /* this section duplicates reportUsage */
  // options include:
  // * population: student, faculty, staff; defaults to all
  // * startDate: defaults to start of logs
  // * endDate: defaults to today

  let firstDate = usage.getFirstDate(data); // do this before applying filters
  let endDate = options.endDate || dayjs().format('YYYY-MM-DD');
  let limitByUserType, startDate;

  if (options.hasOwnProperty('population') && options.population != 'all') {
    limitByUserType = options.population;
  }

  if (options.hasOwnProperty('startDate')) {
    startDate = dayjs(options.startDate).format('YYYY-MM-DD');
  }

  // allow user defined startDate if it's greater than first available date
  if ((startDate != undefined) & (dayjs(startDate) > dayjs(firstDate))) {
    firstDate = startDate;
  }

  if (limitByUserType != undefined) {
    data = usage.filterDataByUsertype(data, limitByUserType);
  }
  data = usage.filterByDataByDateRange(data, firstDate, endDate);
  /* end duplicate section */

  let opts = {
    truncateKeyTo: 10,
    fieldsToRetain: ['primaryAffiliation'],
    countLabel: 'timesUsed',
  };

  // how many times did each user log in
  let counts = usage.countEntriesByProperty(data, 'user', opts);

  // how many users had the same number of uses
  opts = { countLabel: 'users' };
  let summary = usage.countEntriesByProperty(counts, 'timesUsed', opts);
  return { options, repeatUserData: summary };
};

module.exports = getRepeatUsers;
