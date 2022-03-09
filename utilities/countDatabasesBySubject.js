// run with argument "csv" for csv output, else json
const subjects = require('../cache/Subjects');
const databases = require('../cache/Databases');
const LibAppsDataFilter = require('../models/libGuides/LibAppsDataFilter');
const json2csv = require('json2csv');
const f = new LibAppsDataFilter();
let output = [];
let format = process.argv[2] || 'json';

subjects.forEach((s) => {
  let topDbs = f.filterBySubject(databases, s.name, true);
  let subjDbs = f.filterBySubject(databases, s.name);
  output.push({ database: s.name, top: topDbs.length, all: subjDbs.length });
});

if (format === 'csv') {
  console.log(json2csv.parse(output));
} else {
  console.log(JSON.stringify(output, null, 2));
}
