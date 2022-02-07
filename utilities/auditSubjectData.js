/*
checks to see that there is no duplication in subjCodes
checks to identify missing regCodes, deptCodes, majorCodes
doesn't care about majorCodes from regional campuses (RC.*)
identify any missing cached libguides (present in subject list, missing from cache)
identify subjects with no libguides listed
*/
const config = require('config');
const colors = require('colors');
const path = require('path');
subjectDataFilename = config.get('app.subjectConfigFilename');
subjectDataFile = path.join(__dirname, '..', 'config', subjectDataFilename);
const auditSubjectData = require('../models/dataAudit/subjectAudit');
const audit = new auditSubjectData(subjectDataFile);
const flags = process.argv.slice(2)[0];

// default settings flags
let verbose = false;
// let verboseMajors = false;
// let verboseReg = false;
// let verboseDept = false;
let includeRegionals = false;
let verboseDuplicates = false;
let verboseNoLibguides = false;
// let verboseLibGuideNameErrors = false;
// let outputReportFiles = false;

// process flags
if (flags) {
  if (flags.includes('v')) {
    verbose = true;
  }
  //   if (flags.includes('m')) {
  //     verboseMajors = true;
  //   }
  //   if (flags.includes('r')) {
  //     verboseReg = true;
  //   }
  //   if (flags.includes('d')) {
  //     verboseDept = true;
  //   }
  if (flags.includes('i')) {
    includeRegionals = true;
  }
  if (flags.includes('p')) {
    verboseDuplicates = true;
  }
  if (flags.includes('n')) {
    verboseNoLibguides = true;
  }
  //   if (flags.includes('l')) {
  //     verboseLibGuideNameErrors = true;
  //   }
  //   if (flags.includes('f')) {
  //     outputReportFiles = true;
  //   }
}

// check for valid data
let loadResponse = audit.loadData();
if (loadResponse.valid === false) {
  console.log(colors.red('subject List is not an object'));
  console.log(colors.yellow(loadResponse.message));
  process.exit(1);
} else {
  console.log(colors.green('subject List is an object'));
}

// check for duplicate codes
let dupResponse = audit.checkForDuplicateCodes();
if (dupResponse.valid === false) {
  console.log(colors.red('subject List has duplicate codes'));
  console.log(colors.yellow(dupResponse.message));
  if (verboseDuplicates || verbose) {
    console.log(colors.yellow(dupResponse.duplicateCodes));
  }
  process.exit(1);
} else {
  console.log(colors.green('subject List has no duplicate codes'));
}

// check for subjects without libguides
let missingLGResponse = audit.subjectsWithoutLibguides();
if (includeRegionals === false) {
  missingLGResponse = audit.filterRemoveWhereCondition(
    missingLGResponse,
    'regional',
    true
  );
}
if (missingLGResponse.length > 0) {
  console.log(
    colors.red(
      'subject List has subjects without libguides: ' + missingLGResponse.length
    )
  );
  if (verbose || verboseNoLibguides)
    console.log(colors.yellow(missingLGResponse.map((i) => i.name)));
  process.exit(1);
} else {
  console.log(colors.green('subject List has no subjects without libguides'));
}
