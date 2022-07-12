const Usage = require('../models/usageLog/Usage');
const usage = new Usage();
const { getOpts, applyDataLimiters } = require('./dataAnalysisHelpers');

// const getData = require('./scripts/getUsageData');
// data = getData();
// data = usage.filterDataByUsertype(data, 'student');

getRepeatUsers = function (data, userOptions) {
  // userOptions include:
  // * population: student, faculty, staff; defaults to all
  // * startDate: defaults to start of logs
  // * endDate: defaults to today
  // * breakpoint: all items with labels greater than this value will be grouped together; default false

  userOpts = getOpts(data, userOptions);
  data = applyDataLimiters(data, userOpts);

  // how many times did each user log in
  let countUserOpts = {
    truncateKeyTo: 10, // truncate user hash to this many characters
    fieldsToRetain: ['primaryAffiliation'],
    countLabel: 'timesUsed',
  };
  let counts = usage.countEntriesByProperty(data, 'user', countUserOpts);

  // how many users had the same number of uses
  let countTimesUsedOpts = { countLabel: 'users' };
  let rawSummary = usage.countEntriesByProperty(
    counts,
    'timesUsed',
    countTimesUsedOpts
  );
  let summary;

  if (userOpts.breakpoint == false || userOpts.breakpoint == 'false') {
    summary = rawSummary;
  } else {
    summary = CondenseUserData(rawSummary, {
      valueKey: 'users',
      labelKey: 'timesUsed',
      breakpoint: userOpts.breakpoint,
    });
  } // end if breakpoint
  return {
    options: {
      population: userOpts.population,
      startDate: userOpts.startDate,
      endDate: userOpts.endDate,
      breakpoint: userOpts.breakpoint,
    },
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
