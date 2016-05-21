const enums = [
  'CONFIG_SECTION_INVALID'
];

global.ENUM = () => {
  var obj = {}, i = 1000;
  enums.forEach((e) => {
    obj[e] = i++;
  });
  return obj;
}();

global.APP = {
  exit: function (code) {
    if (code && code >= 0) {
      LOG.error('Fatal non-zero exit code ' + code + ': ' + enums[code - 1000]);
    }
    process.exit(code);
  }
};
