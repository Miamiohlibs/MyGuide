module.exports = class SubjectAudit {
  constructor(filepath) {
    this.filepath = filepath;
  }

  loadData() {
    try {
      this.subjectList = require(this.filepath);
      return { valid: true };
    } catch (err) {
      return { valid: false, errorMessage: err.message };
    }
  }

  getAllCodesOfType(codeType) {
    let codeTypePlural = codeType + 's';
    let allCodesOfType = [];
    this.subjectList.forEach((subject) => {
      if (subject[codeTypePlural] !== undefined) {
        subject[codeTypePlural].forEach((code) => {
          if (code[codeType] !== undefined) {
            allCodesOfType.push(code[codeType]);
          }
        });
      }
    });
    return allCodesOfType;
  }
};
