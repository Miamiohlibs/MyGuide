module.exports = class CspAudit {
  constructor(data, relevantFields = []) {
    this.data = data;
    this.relevantFields = relevantFields;
  }

  index(obj, i) {
    return obj[i];
  }

  limitToRelevantFields() {
    return this.data.map((obj) => {
      // adapted from: https://stackoverflow.com/questions/6393943/convert-a-javascript-string-in-dot-notation-into-an-object-reference
      return this.relevantFields.map((f) =>
        f.split('.').reduce(this.index, obj)
      );
    });
  }
};
