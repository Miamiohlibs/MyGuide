const router = require('express').Router();
const config = require('config');
const path = require('path');
const rootdir = path.dirname(__dirname);
const SubjectsByKey = require('../models/subjects/SubjectsByKey');
const filenamify = require('../utilities/filenamify');
const Logger = require('../helpers/Logger');
const { eq } = require('lodash');
const subjFile = config.get('app.subjectConfigFilename');
const subjCodes = require(rootdir + '/config/' + subjFile);
let subjects = [];
try {
  subjects = new SubjectsByKey(subjCodes);
} catch (error) {
  Logger.error('Error initializing SubjectsByKey:', error);
}

function apiWrapper(content, req) {
  return {
    requestType: req.path,
    responseLength: content.length,
    content: content,
  };
}
router.get('/', (req, res) => {
  res.status(200).json({ message: 'API is working' });
});
// router.get('/resources/:subjectName', async (req, res) => {});
router.get('/resources/regCodes/:code', async (req, res) => {
  const regCode = req.params.code;
  let subject = {};
  try {
    subject = subjects.getSubjectByRegCode(regCode);
  } catch (error) {
    console.error('Error fetching subject by regCode:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
  const libguides = subject.libguides || [];
  const output = libguides.map((lg) => {
    let filename = filenamify(lg);
    return (content = require(`../cache/subjects/${filename}.json`));
  });

  if (output) {
    res.status(200).json(apiWrapper(output, req));
  } else {
    res.status(404).json({ message: 'Subject not found' });
  }
});
router.get('/resources/majorCodes/:code', async (req, res) => {
  const majorCode = req.params.code;
  let subject = {};
  try {
    subject = subjects.getSubjectByMajorCode(majorCode);
  } catch (error) {
    console.error('Error fetching subject by majorCode:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
  const libguides = subject.libguides || [];
  const output = libguides.map((lg) => {
    let filename = filenamify(lg);
    return (content = require(`../cache/subjects/${filename}.json`));
  });

  if (output) {
    res.status(200).json(apiWrapper(output, req));
  } else {
    res.status(404).json({ message: 'Subject not found' });
  }
});
router.get('/resources/deptCodes/:code', async (req, res) => {
  const deptCode = req.params.code;
  let subject = {};
  try {
    subject = subjects.getSubjectByDeptCode(deptCode);
  } catch (error) {
    console.error('Error fetching subject by deptCode:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
  const libguides = subject.libguides || [];
  const output = libguides.map((lg) => {
    let filename = filenamify(lg);
    return (content = require(`../cache/subjects/${filename}.json`));
  });

  if (output) {
    res.status(200).json(apiWrapper(output, req));
  } else {
    res.status(404).json({ message: 'Subject not found' });
  }
});

// router.get('/subjects', async (req, res) => {});

// router.get('/subjects/regCodes/', async (req, res) => {});

// router.get('/subjects/regCodes/:code', async (req, res) => {});

// router.get('/subject/majorCodes', async (req, res) => {});

// router.get('/subject/majorCodes/:code', async (req, res) => {});

// router.get('/subjects/deptCodes', async (req, res) => {});

// router.get('/subjects/deptCodes/:code', async (req, res) => {});

module.exports = router;
