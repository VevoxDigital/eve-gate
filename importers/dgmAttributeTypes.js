'use strict';

const yaml  = require('js-yaml'),
      fs    = require('fs-extra'),
      path  = require('path'),
      _     = require('lodash'),
      async = require('async');

exports = module.exports = (db, done) => {
  var dgmAttributeTypes = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'sde', 'bsd', 'dgmAttributeTypes.yaml')));

  var c = 1;
  async.eachSeries(dgmAttributeTypes, (attr, cb) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(' * Importing attribute ' + c++ + ' of ' + dgmAttributeTypes.length);
    var entry = new db.DogmaTypeAttr({
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
    db.DogmaTypeAttr.find({ _id: attr.attributeID }).remove((err) => {
      if (err) throw err;
      entry.save((err) => {
        if (err) throw new Error(err + '\n' + entry.name + '#' + entry._id);
        cb();
      });
    });
  }, () => { console.log(' Done.'); done(); });
}
