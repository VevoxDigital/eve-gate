'use strict';

const yaml  = require('js-yaml'),
      fs    = require('fs-extra'),
      path  = require('path'),
      _     = require('lodash'),
      async = require('async');

exports = module.exports = (db, done) => {
  var invTypeReactions = yaml.safeLoad(fs.readFileSync(path.join(__dirname, '..', 'sde', 'bsd', 'invTypeReactions.yaml')));
  var reactions = { }, numReactions = 0;
  _.forEach(invTypeReactions, (r) => {
    if (!reactions[r.reactionTypeID]) numReactions++;
    reactions[r.reactionTypeID] = reactions[r.reactionTypeID] || { };
    if (r.input) {
      reactions[r.reactionTypeID].input = reactions[r.reactionTypeID].input || [];
      reactions[r.reactionTypeID].input.push({ typeID: r.typeID, quantity: r.quantity });
    } else reactions[r.reactionTypeID].output = { typeID: r.typeID, quantity: r.quantity };
  });

  var c = 1;
  async.eachSeries(Object.keys(reactions), (r, cb) => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(' * Importing type reaction ' + c++ + ' of ' + numReactions);

    if (!reactions.hasOwnProperty(r)) return cb();

    var reaction = new db.InvTypeReactions({
      _id: r,
      input: reactions[r].input,
      output: reactions[r].output
    });
    db.InvTypeReactions.findById(r).remove((err) => {
      if (err) throw err;
      reaction.save((err) => {
        if (err) throw(err);
        cb();
      });
    });
  }, () => { console.log(' Done.'); done(); });

};
