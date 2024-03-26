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

  extractUrls(data) {
    if (Array.isArray(data)) {
      data = data.flat().join(' ');
    } else {
      data = data;
    }
    const urlRegex =
      /(http|ftp|https)*:*\/\/(([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-]))/gi;
    const matches = data.matchAll(urlRegex);
    const urls = [];
    for (const match of matches) {
      urls.push(match[2]);
    }
    return urls;
  }

  organizeUrlsByType() {}
  getDomainsByType() {}
  compareDomainsToWhitelist() {}
};
