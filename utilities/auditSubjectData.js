/*
checks to see that there is no duplication in subjCodes
ignores regional campuses by default (regional:true)
identify subjects with no libguides listed
identify subjects with no name listed

To add:
identify any missing cached libguides or subjects (present in subject list, missing from cache)
checks to identify subjects with no major, reg, or dept codes
*/
const config = require('config');
const colors = require('colors');
const fs = require('fs');
const path = require('path');
const filenamify = require('./filenamify');
subjectDataFilename = config.get('app.subjectConfigFilename');
subjectDataFile = path.join(__dirname, '..', 'config', subjectDataFilename);
const auditSubjectData = require('../models/dataAudit/subjectAudit');
const { checkPrimeSync } = require('crypto');
const audit = new auditSubjectData(subjectDataFile);
const flags = process.argv.slice(2)[0];

// default settings flags
let verbose = false;
let verboseMissingMajors = false;
let verboseMissingReg = false;
let verboseMissingDept = false;
let verboseMissingLibguides = false;
let verboseSubjectNoName = false;
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
  if (flags.includes('m')) {
    verboseMissingMajors = true;
  }
  if (flags.includes('r')) {
    verboseMissingReg = true;
  }
  if (flags.includes('d')) {
    verboseMissingDept = true;
  }
  if (flags.includes('i')) {
    includeRegionals = true;
  }
  if (flags.includes('p')) {
    verboseDuplicates = true;
  }
  if (flags.includes('L') || flags.includes('l')) {
    verboseNoLibguides = true;
  }
  if (flags.includes('k')) {
    verboseMissingLibguides = true;
  }
  if (flags.includes('n')) {
    verboseSubjectNoName = true;
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
if (!includeRegionals) {
  audit.filterRemoveFromSubjectListWhereCondition('regional', true);
}
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
  console.log(colors.red('subject List has duplicate codes (p)'));
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
if (missingLGResponse.length > 0) {
  console.log(
    colors.red(
      'subject List has subjects without libguides (L): ' +
        missingLGResponse.length
    )
  );
  if (verbose || verboseNoLibguides)
    console.log(colors.yellow(missingLGResponse.map((i) => i.name)));
} else {
  console.log(colors.green('subject List has no subjects without libguides'));
}

// check for subjects with no name
let missingNameResponse = audit.subjectsWithNoName();
if (missingNameResponse.length > 0) {
  console.log(
    colors.red(
      'subject List has subjects without names (n): ' +
        missingNameResponse.length
    )
  );
  if (verbose || verboseSubjectNoName)
    console.log(colors.yellow(missingNameResponse));
} else {
  console.log(colors.green('subject List has no subjects without names'));
}

// get all regNames
let regNames = audit.getAllCodesOfType('regCode', true);
let deptNames = audit.getAllCodesOfType('deptCode', true);
let majorNames = audit.getAllCodesOfType('majorCode', true);
let libguideNames = audit.listUniqueLibguides();

let missingReg = findMissingFiles(regNames);
let missingDept = findMissingFiles(deptNames);
let missingMajor = findMissingFiles(majorNames);
let missingLibguideNames = findMissingFiles(libguideNames);

if (missingReg.length > 0) {
  console.log(
    colors.red(
      'subject List has registrar-codes without a cached file (r): ' +
        missingReg.length
    )
  );
  if (verbose || verboseMissingReg) console.log(colors.yellow(missingReg));
} else {
  console.log(
    colors.green('subject List has no registrar without a cached file')
  );
}

if (missingDept.length > 0) {
  console.log(
    colors.red(
      'subject List has department-code without a cached file (d): ' +
        missingDept.length
    )
  );
  if (verbose || verboseMissingDept) console.log(colors.yellow(missingDept));
} else {
  console.log(
    colors.green('subject List has no department without a cached file')
  );
}

if (missingMajor.length > 0) {
  console.log(
    colors.red(
      'subject List has a major-code without a cached file (m): ' +
        missingMajor.length
    )
  );
  if (verbose || verboseMissingMajors) console.log(colors.yellow(missingMajor));
} else {
  console.log(
    colors.green('subject List has no major files without a cached file')
  );
}

if (missingLibguideNames.length > 0) {
  console.log(
    colors.red(
      'subject List has libguides without a cached file (k): ' +
        missingLibguideNames.length
    )
  );
  if (verbose || verboseMissingLibguides)
    console.log(colors.yellow(missingLibguideNames));
} else {
  console.log(
    colors.green('subject List has no libguides without a cached file')
  );
}

function findMissingFiles(list) {
  return list.filter((subjectName) => {
    if (subjectName !== undefined) {
      let filename = filenamify(subjectName);
      filepath = path.join(
        __dirname,
        '..',
        'cache',
        'subjects',
        filename + '.json'
      );
      if (!fs.existsSync(filepath)) {
        return true;
      }
      return false;
    }
  });
}
