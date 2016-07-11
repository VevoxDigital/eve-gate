'use strict';

const yaml  = require('js-yaml'),
      fs    = require('fs-extra'),
      path  = require('path'),
      _     = require('lodash'),
      async = require('async');

// Refining yields. Associate ore > materials.
exports = module.exports = (db, done) => {
  var invTypeMaterials = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'sde', 'bsd', 'invTypeMaterials.yaml')));
  var mats = { }, numMaterials = 0;

  _.forEach(invTypeMaterials, (m) => {
    if (!mats[m.typeID]) numMaterials++;
    mats[m.typeID] = mats[m.typeID] || [];
    mats[m.typeID].push({ typeID: m.materialTypeID, quantity: m.quantity });
  });

  var c = 1;
  async.eachSeries(Object.keys(mats), (m, cb) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(' * Importing type material ' + c++ + ' of ' + numMaterials);

    var entry = new db.InvTypeMaterials({
      _id: m,
      minerals: mats[m]
    });

    db.InvTypeMaterials.findById(m).remove((err) => {
      if (err) throw err;
      entry.save((err) => {
        if (err) throw err;
        cb();
      });
    });

  }, () => { console.log(' Done.'); done(); });
};
