'use strict';

const yaml  = require('js-yaml'),
      fs    = require('fs-extra'),
      path  = require('path'),
      _     = require('lodash'),
      async = require('async');

exports = module.exports = (db, done) => {
  var dgmTypeAttributes = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'sde', 'bsd', 'dgmTypeAttributes.yaml')));

  var c = 1;
  async.eachSeries(dgmTypeAttributes, (attr, cb) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(' * Updating ' + c++ + ' of ' + dgmTypeAttributes.length);
    db.Type.findById(attr.typeID, (err, type) => {
      if (err) throw err;
      if (!type) { console.log('\nWARNING! Unknown type id: ' + attr.type); return cb(); }
      else {
        type.meta.attributes.push({ attribute: attr.attributeID, value: typeof attr.valueInt === 'number' ? attr.valueInt : attr.valueFloat });
        type.markModified('meta.attributes');
        type.save((err) => {
          if (err) throw new Error(err + '\n' + type.name + '#' + type._id + '@' + attr.attributeID);
          else return cb();
        });
      }
    });
  }, () => { console.log(' Done.'); done(); });
}
