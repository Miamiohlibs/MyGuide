const fs = require('fs');
const path = require('path');
const logfile = path.join(__dirname, '..', 'logs', 'usageLog.txt');

getUsageData = function () {
  let data = [];
  let content = fs.readFileSync(logfile, { flag: 'r' }).toString();
  let strArr = content.split('\n');
  strArr.forEach((i) => {
    if (i.length > 0) {
      data.push(JSON.parse(i));
    }
  });
  return data;
};

module.exports = getUsageData;
