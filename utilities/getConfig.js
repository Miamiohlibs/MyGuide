const config = require('config');
let arg = process.argv[2];
let value = config.get(arg) || config.has(arg);
console.log(value);
