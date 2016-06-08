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

  var Item = mongoose.model('Item', require('./lib/schema/item'));

  try {
    async.eachSeries([ (done) => {
      console.log('Parsing items file...');
      var itemFile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'sde', 'typeIDs.yaml'))), items = [];
      _.forEach(itemFile, (data, id) => {
        data.id = parseInt(id);
        items.push(data);
      });

      var c = 1;
      async.eachSeries(items, (item, cb) => {
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(' * Importing item ' + c++ + ' of ' + items.length);
        var entry = new Item({
          _id: item.id,
          name: item.name.en || 'Unknown',
          published: item.published,
          group: item.groupID,
          meta: {
            mass: item.mass,
            volume: item.volume,
            radius: item.radius
          }
        });
        Item.find({ _id: item.id }).remove((err) => {
          if (err) throw err;
          entry.save((err) => {
            if (err) throw new Error(err + '\n' + entry.name + '#' + entry._id);
            cb();
          });
        });
      }, () => { console.log(); done(); });
    }], (func, cb) => { func(cb); }, () => {
      console.log('Done!');
      process.exit(0);
    });
  } catch (e) {
    console.log(' !! ', e);
    process.exit(-1);
  }

});
