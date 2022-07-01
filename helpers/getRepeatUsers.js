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
  // * breakpoint: all items with labels greater than this value will be grouped together; default false

  let firstDate = options.startDate || usage.getFirstDate(data); // do this before applying filters
  let endDate = options.endDate || dayjs().format('YYYY-MM-DD');
  let breakpoint = options.breakpoint || false;
  let population = options.population || 'all';
  let limitByUserType, startDate;

  if (population != 'all') {
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
    truncateKeyTo: 10, // truncate user hash to this many characters
    fieldsToRetain: ['primaryAffiliation'],
    countLabel: 'timesUsed',
  };

  // how many times did each user log in
  let counts = usage.countEntriesByProperty(data, 'user', opts);

  // how many users had the same number of uses
  opts = { countLabel: 'users' };

  let rawSummary = usage.countEntriesByProperty(counts, 'timesUsed', opts);
  let summary;

  if (options.hasOwnProperty('breakpoint') && options.breakpoint != false) {
    summary = CondenseUserData(rawSummary, {
      valueKey: 'users',
      labelKey: 'timesUsed',
      breakpoint: breakpoint,
    });
  } else {
    summary = rawSummary; // don't condense
  }
  return {
    options: { population, startDate, endDate, breakpoint },
    repeatUserData: summary,
  };
};

function CondenseUserData(data, opts) {
  /* opts:
   * valueKey: the key in the data object to use for the numeric value
   * labelKey: the key in the data object to use for the label (which should be an integer too)
   * breakpoint: all items with labels greater than this value will be grouped together
   */
  let valueKey = opts.valueKey || 'value';
  let labelKey = opts.labelKey || 'label';
  let breakpoint = opts.breakpoint || 10;
  let condensedData = [];
  let summary = 0;

  // keep lower values, condense higher values in to one entry
  data.forEach((d) => {
    if (parseInt(d[labelKey]) < breakpoint) {
      console.log(d);
      condensedData.push(d);
    } else {
      summary += d[valueKey];
    }
  });
  // add the summary entry
  summaryLabel = breakpoint.toString() + '+';
  plusObj = {};
  plusObj[labelKey] = summaryLabel;
  plusObj[valueKey] = summary;
  condensedData.push(plusObj);

  return condensedData;
}

module.exports = getRepeatUsers;
