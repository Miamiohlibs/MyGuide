/* 
    Some of the cached data needs to be cleaned up before it's served.
    E.g. Librarians have styling code in their widgets that we may want to suppress, like the color of their Schedule Me buttons
    This code runs after downloading the API data from Springshare and cleans it in the cache so cleaning doesn't have to happen at run time.
*/

const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = class CleanCache {
  addScheduleClass(widgetCode) {
    let dom = new JSDOM('<body>' + widgetCode + '</body>');
    let doc = dom.window.document;
    let body = doc.querySelector('body');
    let schedButton = doc.querySelector('button[id^="mysched" i]');
    if (schedButton === null) {
      return widgetCode;
    }
    schedButton.setAttribute('class', 'mysched');
    return body.innerHTML;
  }

  removeScheduleStyles(widgetCode) {
    let dom = new JSDOM('<body>' + widgetCode + '</body>');
    let doc = dom.window.document;
    let body = doc.querySelector('body');
    let localStyles = doc.querySelectorAll('style');
    localStyles.forEach((node) => {
      if (node.outerHTML.toLowerCase().includes('mysched')) {
        node.remove();
      }
    });
    return body.innerHTML;
  }

  updateWidgetCode(widgetCode) {
    return this.removeScheduleStyles(this.addScheduleClass(widgetCode));
  }
};
