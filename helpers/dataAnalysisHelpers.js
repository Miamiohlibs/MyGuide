const Usage = require('../models/usageLog/Usage');
const usage = new Usage();
const dayjs = require('dayjs');

getOpts = function (data, userOptions) {
  let opts = {};
  opts.firstDate = userOptions.startDate || usage.getFirstDate(data); // do this before applying filters
  opts.endDate = userOptions.endDate || dayjs().format('YYYY-MM-DD');
  opts.breakpoint = userOptions.breakpoint || false;
  opts.population = userOptions.population || 'all';
  opts.subjectType = userOptions.subjectType || 'all';

  if (opts.population != 'all') {
    opts.limitByUserType = userOptions.population;
  }

  if (userOptions.hasOwnProperty('startDate')) {
    opts.startDate = dayjs(userOptions.startDate).format('YYYY-MM-DD');
  }

  if (opts.subjectType != 'all') {
    opts.subjectType = opts.subjectType;
  }

  // allow user defined startDate if it's greater than first available date
  if (
    (opts.startDate != undefined) &
    (dayjs(opts.startDate) > dayjs(opts.firstDate))
  ) {
    opts.firstDate = opts.startDate;
  }
  return opts;
};

applyDataLimiters = function (data, opts) {
  if (opts.limitByUserType != undefined) {
    data = usage.filterDataByUsertype(data, opts.limitByUserType);
  }
  data = usage.filterByDataByDateRange(data, opts.firstDate, opts.endDate);
  return data;
};

module.exports = {
  getOpts,
  applyDataLimiters,
};
