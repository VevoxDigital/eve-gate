'use strict';

const router = require('express').Router();

router.get('/', (req, res, next) => {
  if (req.query.id) {
    // Specific item requested. Send entire item.
    if (parseInt(req.query.id === NaN)) return res.status(400).send('ID must be a number');
    req.$database.Item.findById(req.query.id, (err, type) => {
      if (err) return next(err);
      else if (!type) res.status(404).send('Unknown type ID');
      else res.send(type);
    });
  } else if (req.query.name) {
    // Searching by name. Send only Name/ID.
    req.$database.Item.find({ name: new RegExp(req.query.name, 'i') })
      .limit(50)
      .select('id name')
      .sort('name')
      .exec((err, items) => {
        if (err) return next(err);
        else res.send(items);
      });
  } else if (req.query.group) {
    // Get all items in a group. Send only Name/ID.
    if (parseInt(req.query.group === NaN)) return res.status(400).send('Group must be a number');
    req.$database.Item.find({ group: req.query.group })
      .select('id name')
      .sort('id')
      .exec((err, items) => {
        if (err) return next(err);
        else res.send(items);
      });
  } else res.status(400).send('Missing ID or name');
});

exports = module.exports = router;
