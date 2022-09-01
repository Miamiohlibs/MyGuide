const path = require('path');
const fs = require('fs-extra');
const dayjs = require('dayjs');
const hash = require('sha256');
const outputPath = path.join(__dirname, '..', '..', 'logs', 'requestLog.txt');
fs.ensureFileSync(outputPath);

const logUrl = function (req) {
  data = {
    url: req.url,
    method: req.method,
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  };
  fs.appendFile(outputPath, '\n' + JSON.stringify(data));
};

module.exports = logUrl;
