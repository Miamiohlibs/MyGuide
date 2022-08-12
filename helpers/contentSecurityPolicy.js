const config = require('config');
let defaultSrcAdditions = '';
let imgSrcAdditions = '';
let scriptSrcAdditions = '';
let styleSrcAdditions = '';
let fontSrcAdditions = '';
let frameSrcAdditions = '';

let attrArray = [
  'defaultSrcAdditions',
  'imgSrcAdditions',
  'scriptSrcAdditions',
  'styleSrcAdditions',
  'fontSrcAdditions',
  'frameSrcAdditions',
];

for (let i = 0; i < attrArray.length; i++) {
  if (config.has('server.csp.' + attrArray[i])) {
    let str = config.get('server.csp.' + attrArray[i]);
    eval(attrArray[i] + ' += " ' + str + '";');
  }
}

const cspPolicy = {
  'frame-ancestors': 'none',
  'default-src': "'self'" + defaultSrcAdditions,
  'img-src': "'self'" + imgSrcAdditions,
  'script-src':
    "'self' 'unsafe-inline' 'unsafe-eval' cdnjs.cloudflare.com cdn.jsdelivr.net" +
    scriptSrcAdditions,
  'style-src':
    "'self' 'unsafe-inline' cdnjs.cloudflare.com cdn.jsdelivr.net" +
    styleSrcAdditions,
  'font-src': "'self' cdn.jsdelivr.net cdnjs.cloudflare.com" + fontSrcAdditions,
  'frame-src': "'self'" + frameSrcAdditions,
};

module.exports = cspPolicy;
