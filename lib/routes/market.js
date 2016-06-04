const router = require('express').Router();

router.get('/', (req, res) => {
  if (req.query.item) {
    req.$redis.get('market:' + req.query.item, (err, reply) => {
      if (err) return res.status(500).send(err);
      if (!reply) return res.status(404).send('Unknown item ID');
      var item = JSON.parse(reply);
      if (req.query.region) {
        var region = item.regions[req.query.region];
        if (!region) res.status(404).send('Unknown region ID');
        if (req.query.station) {
          var station = region.stations[req.query.station];
          if (!station) res.status(404).send('Unknown station ID');
          res.send(station);
        } else res.send(region);
      } else res.send(item);
    });
  } else res.status(400).send('Must specify item ID');
});

module.exports = exports = router;
