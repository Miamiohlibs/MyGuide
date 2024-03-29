// const logConf = require('../config/default');
const config = require('config');
const logConf = config.get('logLevels');
const path = require('path');
const dayjs = require('dayjs');
const today = dayjs().format('YYYY-MM-DD');
const month = dayjs().format('YYYY-MM');
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, prettyPrint } = format;

transportsArr = [];

for (level in logConf) {
  filename = '';
  if (logConf[level] == 'daily') {
    filename = path.join(__dirname, '..', 'logs', level + '-' + today + '.log');
  } else if (logConf[level] == 'monthly') {
    filename = path.join(__dirname, '..', 'logs', level + '-' + month + '.log');
  }
  if (filename != '') {
    transportsArr.push(
      new transports.File({ filename: filename, level: level })
    );
  }
}

const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
    format.json()
    // format.json((info) => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: transportsArr,
});
module.exports = logger;
