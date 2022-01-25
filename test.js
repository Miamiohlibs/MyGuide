const Udc = require('./controllers/UserDataController');
const udc = new Udc();
const sampleData = require('./models/userLoginData/test/sample-data/rawCasData1.json');
res = udc.getUserData(sampleData);
console.log(res);

// const CasDataGetter = require('./models/userLoginData/cas/CasDataGetter');
// const cdg = new CasDataGetter({ conf: 'fake' });

// let res = cdg.getUserData('123456789');
// console.log(res);

// const subjectMap = require('./config/miami_subjects.json');
// const UserSubjectInfo = require('./repositories/UserSubjectInfo');

// user = {
//   attr: {
//     deptCodes: ['ulb', 'mjf'],
//   },
// };

// let userSubjectInfo = new UserSubjectInfo(user, subjectMap);
// userSubjectInfo.addSubjectsFromMajors();
// userSubjectInfo.addSubjectsFromCourses();
// userSubjectInfo.addSubjectsFromDepts();
// userSubjectInfo.reduceSubjectsToNames();
// console.log(userSubjectInfo.returnSubjectList());
