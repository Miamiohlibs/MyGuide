const getUsageData = require('./helpers/getUsageData');
// const reportUsage = require('./helpers/reportUsage');
const getRepeatUsers = require('./helpers/getRepeatUsers');
let data = getUsageData();

let report = getRepeatUsers(data, {});
console.log(report);
