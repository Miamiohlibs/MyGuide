const filenamify = (str) => {
  return str.replace(/[\W_]+/g, '');
};

module.exports = filenamify;
