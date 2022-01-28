const Udc = require('./controllers/UserDataController');
const udc = new Udc();
const sampleData = require('./models/userLoginData/test/sample-data/rawCasData1.json');
const UserLoginInfo = require('./models/userLoginData/UserLoginInfo');
const UserSubjectInfo = require('./models/userLoginData/UserSubjectInfo');
const UserLibGuidesData = require('./models/userLoginData/UserLibGuidesData');
userLoginInfo = udc.getUserData(sampleData);
let user = { attr: userLoginInfo, rawUserData: sampleData };
console.log(userLoginInfo);
subjectMap = require('./config/miami_subjects.json');

let userSubjectInfo = new UserSubjectInfo(user, subjectMap);
userSubjectInfo.addSubjectsFromMajors();
userSubjectInfo.addSubjectsFromCourses();
userSubjectInfo.addSubjectsFromDepts();
userSubjectInfo.reduceSubjectsToNames();
userSubjectInfo.removeTempData();
let subjectList = userSubjectInfo.returnSubjectList();

let userLibGuides = new UserLibGuidesData(subjectList);
// let userLibGuides = new UserLibGuidesData()
finishedUserData = {
  person: userLoginInfo,
  uniqueSubjects: subjectList,
  subjectData: userLibGuides,
  userLoginInfo: user.rawUserData,
};
console.log(finishedUserData);

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
