const Usage = require('../models/usageLog/Usage');
const usage = new Usage();
const { getOpts, applyDataLimiters } = require('./dataAnalysisHelpers');

reportUsage = function (data, increment, options = {}) {
  // options include:
  // * population: student, faculty, staff; defaults to all
  // * startDate: defaults to start of logs
  // * endDate: defaults to today

  opts = getOpts(data, options);
  data = applyDataLimiters(data, opts);
  // console.log(opts);

  if (increment == 'all') {
    let json = {
      startDate: opts.firstDate,
      endDate: opts.endDate,
      increment: increment,
      population: opts.limitByUserType,
      totalUses: data.length,
      distinctUsers: usage.distinctUsers(data),
      details: [
        {
          period: opts.firstDate + ' to ' + opts.endDate,
          periodUses: data.length,
          periodDistinctUsers: usage.distinctUsers(data),
        },
      ],
    };
    return json;
  }

  let statsResults = usage.getStatsByTimePeriod(
    increment,
    data,
    opts.firstDate,
    opts.endDate
  );

  let json = {
    startDate: opts.firstDate,
    endDate: opts.endDate,
    increment: increment,
    population: opts.limitByUserType,
    totalUses: data.length,
    distinctUsers: usage.distinctUsers(data),
    details: statsResults,
  };
  return json;
};

module.exports = reportUsage;
