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

router.post('/appraisal', (req, res, next) => {
  if (typeof req.body.query !== typeof [] || isNaN(req.body.query.length))
    return res.status(400).json({ message: 'Expected array of query terms' });
  /*if (req.body.station && !Object.keys(stationIDTable).includes(req.body.station))
    return res.status(400).json({ message: 'Invalid station request. (Station ID requests coming soon)' });*/
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
          cb();
        } else if (req.body.station) {
          MARKET.getStationBest(stationIDTable[req.body.station], type._id)
            .catch(cb)
            .then((best) => {
              try {
                response.push({
                  name: type.name,
                  volume: type.meta.volume,
                  quantity: query.num,
                  price: { buy: best.buy ? best.buy.price : 0, sell: best.sell ? best.sell.price : 0 },
                });
                cb();
              } catch (err) { console.log(err); }
            });
        } else {
          response.push({
            name: type.name,
            volume: type.meta.volume,
            quantity: query.num,
            price: type.market.est
          });
          cb();
        }
      });
  }, (err) => {
    if (err) { console.log(err); res.status(500).json(err); }
    else res.json(response);
  });
});

exports = module.exports = router;
