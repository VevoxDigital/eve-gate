'use strict';

const yaml  = require('js-yaml'),
      fs    = require('fs-extra'),
      path  = require('path'),
      _     = require('lodash'),
      async = require('async');

exports = module.exports = (db, done) => {

  // Load the file from `/sde/fsd/typeIDs.yaml` and push to master array.
  var typesFile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'sde', 'fsd', 'typeIDs.yaml'))), types = [];
  _.forEach(typesFile, (data, id) => {
    data.id = Number(id);
    types.push(data);
  });

  // Import each type into the database.
  var c = 1;
  async.eachSeries(types, (type, cb) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(' * Importing type ' + c++ + ' of ' + types.length);
    var entry = new db.Type({
      _id: type.id,
      name: type.name.en || 'Unknown',
      published: type.published,
      group: type.groupID,
      meta: {
        mass: type.mass,
        volume: type.volume,
        radius: type.radius,
        description: type.description ? type.description.en : undefined
      }
    });
    db.Type.find({ _id: type.id }).remove((err) => {
      if (err) throw err;
      entry.save((err) => {
        if (err) throw new Error(err + '\n' + entry.name + '#' + entry._id);
        cb();
      });
    });
  }, () => { console.log(' Done.'); done(); });
};
