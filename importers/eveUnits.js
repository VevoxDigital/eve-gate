'use strict';

const yaml  = require('js-yaml'),
      fs    = require('fs-extra'),
      path  = require('path'),
      _     = require('lodash'),
      async = require('async');

exports = module.exports = (db, done) => {
  var eveUnits = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'sde', 'bsd', 'eveUnits.yaml'))), units = [];
  _.forEach(eveUnits, (u) => { units.push(u) });

  var c = 1;
  async.eachSeries(units, (unit, cb) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(' * Importing unit ' + c++ + ' of ' + units.length);
    var entry = new db.Unit({
      _id: unit.unitID,
      name: unit.unitName,
      description: unit.description,
      displayName: unit.displayName
    });
    db.Unit.findById(unit.unitID).remove((err) => {
      if (err) throw err;
      entry.save((err) => {
        if (err) throw new Error(err + '\n' + entry.name + '#' + entry._id);
        cb();
      });
    });
  }, () => { console.log(' Done.'); done(); });
};
