'use strict';

const async = require('async'),
      _     = require('lodash');

const router = require('express').Router();

router.get('/', (req, res, next) => {
  if (req.query.id) {
    // Specific item requested. Send entire item.
    if (parseInt(req.query.id === NaN)) return res.status(400).send('ID must be a number');
    req.$database.Type.findById(req.query.id, (err, type) => {
      if (err) return next(err);
      else if (!type) res.status(404).send('Unknown type ID');
      else {
        var r = { attrs: [] };
        async.eachSeries(type.meta.attributes, (attr, cb) => {
          req.$database.DogmaTypeAttr.findById(attr._id, (err, a) => {
            if (err) return next(err);
            else if (a) {
              a.value = attr.value;
              r.attrs.push(a);
              cb();
            } else cb();
          });
        }, () => {
          r._id = type._id;
          r.name = type.name;
          r.meta = {
            mass: type.meta.mass,
            volume: type.meta.volume,
            radius: type.meta.radius,
            description: type.meta.description
          };
          r.published = type.published;
          r.group = type.group;
          res.send(r);
        });
      }
    });
  } else if (req.query.name) {
    // Searching by name. Send only Name/ID.
    req.$database.Type.find({ name: new RegExp(req.query.name, 'i') })
      //.limit(50)
      .select('id name')
      //.sort('name')
      .exec((err, items) => {
        if (err) return next(err);
        else res.send(items.sort((a, b) => { return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0); }));
      });
  } else if (req.query.group) {
    // Get all items in a group. Send only Name/ID.
    if (parseInt(req.query.group === NaN)) return res.status(400).send('Group must be a number');
    req.$database.Type.find({ group: req.query.group })
      .select('id name')
      .sort('id')
      .exec((err, items) => {
        if (err) return next(err);
        else res.send(items);
      });
  } else res.status(400).send('Missing ID or name');
});

exports = module.exports = router;
