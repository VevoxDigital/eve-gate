'use strict';

const path  = require('path'),
      fs    = require('fs-extra');

module.exports = fs.readFileSync(path.join(__dirname, '..', '.secret'));
