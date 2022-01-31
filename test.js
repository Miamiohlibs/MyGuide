const Udc = require('./controllers/UserDataController');
const udc = new Udc();
const sampleData = require('./models/userLoginData/test/sample-data/rawCasData1.json');

finishedUserData = udc.getUserData(sampleData);

// console.log(finishedUserData.subjectData[0].resources);

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
