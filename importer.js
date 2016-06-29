'use strict';
/**
  * SDE Importer for Tech 3
  */
const yaml = require('js-yaml'),
      fs   = require('fs-extra'),
      path = require('path'),
      _    = require('lodash');

const mongoose = require('mongoose'),
      config   = require('nconf'),
      async    = require('async');

config.argv().env().file({ file: path.join(__dirname, 'cfg', 'config.json') });

console.log('Attempting to connect to the database...');
const dbURL = 'mongodb://' + config.get('db:host') + ':' + config.get('db:port') + '/' + config.get('db:db');
mongoose.connect(dbURL, {}, () => {
  console.log('Database connection successful. Starting importers...');

  // Load database models.
  var db = { $schema: require(path.join(__dirname, 'server', 'lib', 'schema')) };
  _.forEach(db.$schema, (schema, name) => { db[name] = mongoose.model(name, schema); });

  // Imports and dependencies.
  var imports = {
    typeIDs: [],
    dgmAttributeTypes: [],
    dgmTypeAttributes: ['typeIDs', 'dgmAttributeTypes'],
    eveUnits: []
  };
  var importer = (im, done) => {
    var callImporter = () => {
      console.log('Running importer for `' + im + '`');
      require(path.join(__dirname, 'importers', im))(db, done);
    };
    if (imports[im].length && !config.get('ignore-deps')) {
      console.log('Importer `' + im + '` has dependencies: ' + imports[im]);
      async.eachSeries(imports[im], importer, callImporter);
    }
    else callImporter();
  };

  var notFlagged = 0;
  async.eachSeries(Object.keys(imports), (im, cb) => {
    if (config.get(im) || config.get('all')) importer(im, cb);
    else { notFlagged++; cb(); }
  }, () => {
    console.log('Of', _.size(imports), 'importers,', _.size(imports)-notFlagged, 'were called.');
    process.exit(0);
  });
});
