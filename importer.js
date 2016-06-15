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

  var Item          = mongoose.model('Type', require('./lib/schema/item')),
      DogmaTypeAttr = mongoose.model('DogmaTypeAttr', require('./lib/schema/dogmaTypeAttr'));

  try {
    async.eachSeries([
      (done) => {
        console.log('Importing types...');
        var itemFile = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'sde', 'fsd', 'typeIDs.yaml'))), items = [];
        _.forEach(itemFile, (data, id) => {
          data.id = parseInt(id);
          items.push(data);
        });

        var c = 1;
        async.eachSeries(items, (item, cb) => {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(' * Importing type ' + c++ + ' of ' + items.length);
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
      },
      (done) => {
        console.log('Importing attributes...');
        var dgmAttributeTypes = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'sde', 'bsd', 'dgmAttributeTypes.yaml')));

        var c = 1;
        async.eachSeries(dgmAttributeTypes, (attr, cb) => {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(' * Importing attribute ' + c++ + ' of ' + dgmAttributeTypes.length);
          var entry = new DogmaTypeAttr({
            _id: attr.attributeID,
            name: attr.attributeName,
            category: attr.categoryID,
            published: attr.published,
            meta: {
              displayName: attr.displayName,
              stackable: attr.stackable,
              highIsGood: attr.highIsGood,
              description: attr.description
            }
          });
          DogmaTypeAttr.find({ _id: attr.attributeID }).remove((err) => {
            if (err) throw err;
            entry.save((err) => {
              if (err) throw new Error(err + '\n' + entry.name + '#' + entry._id);
              cb();
            });
          });
        }, () => { console.log(); done(); });
      },
      (done) => {
        console.log('Updaing type attributes...');
        var dgmTypeAttributes = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'sde', 'bsd', 'dgmTypeAttributes.yaml')));

        var c = 1;
        async.eachSeries(dgmTypeAttributes, (attr, cb) => {
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(' * Updating ' + c++ + ' of ' + dgmTypeAttributes.length);
          Item.findById(attr.typeID, (err, item) => {
            if (err) throw err;
            if (!item) { console.log('\nWARNING! Unknown type id: ' + attr.type); cb(); }
            else {
              item.meta.attributes.push({ id: attr.attributeID, value: typeof attr.valueInt === 'number' ? attr.valueInt : attr.valueFloat });
              item.save((err) => {
                if (err) throw new Error(err + '\n' + item.name + '#' + item._id + '@' + attr.attributeID);
                else cb();
              });
            }
          });
        }, () => { console.log(); cb(); });
      }
    ], (func, cb) => { func(cb); }, () => {
      console.log('Done!');
      process.exit(0);
    });
  } catch (e) {
    console.log(' !! ', e);
    process.exit(-1);
  }

});
