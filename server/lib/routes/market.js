'use strict';

const async   = require('async'),
      router  = require('express').Router();

// TODO Station ID lookup
var stationIDTable = {
  jita: 60003760, // Jita
  amarr: 60008494, // Amarr
  dodixie: 60011866, // Dodi
  hek: 60005686, // Hek
  rens: 60004594  // Rens
}

// User attempts to create a permalink.
router.put('/permalink', (req, res, next) => {
  if (typeof req.body.query !== typeof [] || isNaN(req.body.query.length))
    return res.status(400).json({ message: 'Expected array of query terms' });
  var pl = new req.$database.AppraisalPL({
    items: req.body.query
  });
  pl.save((err) => {
    if (err) return res.status(500).json(err);
    else return res.send(pl._id);
  });
});

// User attempts to fetch a permalink
router.get('/permalink/*', (req, res, next) => {
  req.$database.AppraisalPL.findById(req.lastParam, (err, pl) => {
    if (err) return res.status(500).json(err);
    if (!pl) return res.status(404).json({ message: 'Unknown permalink ID' });
    res.json(pl.toObject());
  });
});

router.post('/appraisal', (req, res, next) => {
  if (typeof req.body.query !== typeof [] || isNaN(req.body.query.length))
    return res.status(400).json({ message: 'Expected array of query terms' });
  var response = [];
  async.eachSeries(req.body.query, (query, cb) => {
    if (!query.name) return cb();
    query.num = query.num || 1;
    req.$database.Type.findOne({ name: new RegExp('^' + query.name + '$', 'i') })
      .select('name market meta.volume')
      // TODO Group?
      .exec((err, type) => {
        if (err) return cb(err);
        else if (!type) {
          response.push({ name: query.name, err: 'Unknown Type Name' });
          return cb();
        } else if (Number(req.body.region)) {
          MARKET.getBest(Number(req.body.region), type._id)
            .catch(cb)
            .then((best) => {
              try {
                response.push({
                  _id: type._id,
                  name: type.name,
                  volume: type.meta.volume,
                  quantity: query.num,
                  price: { buy: best.buy ? best.buy.price : 0, sell: best.sell ? best.sell.price : 0 }
                });
                return cb();
              } catch (e) { console.log(e); }
            });
        } else {
          response.push({
            _id: type._id,
            name: type.name,
            volume: type.meta.volume,
            quantity: query.num,
            price: type.market.est
          });
          return cb();
        }
      });
  }, (err) => {
    if (err) { console.log(e); res.status(500).json(e); }
    else res.json(response);
  });
});

exports = module.exports = router;
