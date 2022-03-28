const Usage = require('../models/usageLog/Usage');
const usage = new Usage();
const dayjs = require('dayjs');

reportUsage = function (data, increment, options = {}) {
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

  let statsResults = usage.getStatsByTimePeriod(
    increment,
    data,
    firstDate,
    endDate
  );

  let json = {
    startDate: firstDate,
    endDate: endDate,
    increment: increment,
    population: limitByUserType,
    totalUses: data.length,
    distinctUsers: usage.distinctUsers(data),
    details: statsResults,
  };
  return json;
};

module.exports = reportUsage;
