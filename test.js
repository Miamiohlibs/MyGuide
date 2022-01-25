const getMethods = (obj) =>
  Object.getOwnPropertyNames(obj).filter(
    (item) => typeof obj[item] === 'function'
  );
getProps = (obj) => Object.getOwnPropertyNames(obj);
const Udc = require('./controllers/UserDataController');
const udc = new Udc();

res = udc.getUserData('123456789');
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
