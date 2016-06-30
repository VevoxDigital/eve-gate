'use strict';

const async   = require('async'),
      router  = require('express').Router();

router.get('/group/*', (req, res, next) => {
  // TODO Group type requests.
  res.status(503).json({ message: 'Group type requests not yet available' });
});

router.get('/*', (req, res, next) => {
  if (!req.lastParam.length)
    return res.status(400).json({ message: 'No request param specified.' });
  if (isNaN(req.lastParam)) {
    // A search string was sent.
    req.$database.Type.find({ name: new RegExp(req.lastParam, 'i') })
      .where('_id').lt(300000)
      .select('id name')
      .exec((err, items) => {
        if (err) return next(err);
        else res.send(items.sort((a, b) => { return a.name > b.name ? 1 : (a.name < b.name ? -1 : 0); }));
      });
  } else {
    // An item id was sent.
    req.$database.Type.findById(parseInt(req.lastParam))
      .populate('meta.attributes.attribute')
      .exec((err, type) => {
        if (err) return next(err);
        else if (!type) res.status(404).json({ message: 'No item with given type ID' });
        else req.$database.Type.populate(type, { path: 'meta.attributes.attribute.meta.unit', model: 'Unit' }, (err, type) => {
          if (err) return next(err);
          else res.json(type.toObject());
        });
      });
  }
});

exports = module.exports = router;
