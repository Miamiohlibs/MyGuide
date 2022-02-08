/* 
This script takes the cache/LibrariansTemp.js file created by the main
getData script; it strips the individual scheduler styles and applies universal 
MyGuide styles to librarians' schedule widgets.

Outcomes:
* removes inline <style> tag from widgets
* adds class 'mysched' to the existing tag with the id='mysched_#####' 

This should be run before the "services/updateSubjectCache" script; running the
compileSubjectCache.sh or getData.sh scripts will queue these two scripts 
in the expected order. 

Normally it will not be necessary to run this script directly.
*/

// const fs = require('fs');
const path = require('path');
const util = require('util');
const rootdir = path.dirname(__dirname);
const librarians = require(rootdir + '/cache/LibrariansTemp');
const CleanCache = require(rootdir + '/models/libGuides/CleanCache');
const clean = new CleanCache();
const widget_fields = ['widget_la', 'widget_lc', 'widget_other'];

librarians.forEach((libn) => {
  widget_fields.forEach((field) => {
    if (libn.profile.hasOwnProperty(field)) {
      libn['profile'][field] = clean.updateWidgetCode(libn['profile'][field]);
    }
  });
});

console.log(
  'const librarians =',
  util.inspect(librarians, { showHidden: false, depth: null }),
  ';'
);
console.log('module.exports = librarians;');
