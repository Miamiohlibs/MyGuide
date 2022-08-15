const config = require('config');
let defaultSrcAdditions,
  imgSrcAdditions,
  scriptSrcAdditions,
  styleSrcAdditions,
  fontSrcAdditions,
  frameSrcAdditions,
  objectSrcAdditions;

let attrArray = [
  'defaultSrcAdditions',
  'imgSrcAdditions',
  'scriptSrcAdditions',
  'styleSrcAdditions',
  'fontSrcAdditions',
  'frameSrcAdditions',
  'objectSrcAdditions',
];

for (let i = 0; i < attrArray.length; i++) {
  if (config.has('server.csp.' + attrArray[i])) {
    let arr = config.get('server.csp.' + attrArray[i]);
    eval(attrArray[i] + ' = ' + JSON.stringify(arr));
  } else {
    eval(attrArray[i] + ' = []');
  }
}

const cspPolicy = {
  defaultSrc: ["'self'"].concat(defaultSrcAdditions),
  scriptSrc: [
    "'self'",
    "'unsafe-inline'",
    "'unsafe-eval'",
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net',
    'd3js.org',
    'ajax.googleapis.com',
  ].concat(scriptSrcAdditions),
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    'cdnjs.cloudflare.com',
    'cdn.jsdelivr.net',
  ].concat(styleSrcAdditions),
  fontSrc: ["'self'", 'cdn.jsdelivr.net', 'cdnjs.cloudflare.com'].concat(
    fontSrcAdditions
  ),
  frameSrc: ["'self'"].concat(frameSrcAdditions),
  imgSrc: ["'self'", 'data:', 'w3.org/svg/2000'].concat(imgSrcAdditions),
  objectSrc: ["'none'"].concat(objectSrcAdditions),
};

module.exports = cspPolicy;
