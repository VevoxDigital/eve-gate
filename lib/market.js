const config  = require('nconf'),
      async   = require('async'),
      https    = require('https');

const url = 'https://crest-tq.eveonline.com/market/';
const prefix = 'market';

exports = module.exports = function (redis) {
  var marketFunc = () => {
    // Update the market data.
    LOG.info('Updating market data at ' + new Date().toString());
    async.eachLimit(config.get('dev') ? [REGIONS[1]] : REGIONS, 10, (region, cb) => {
      var href = url + region.id + '/orders/all/';
      var page = 1;
      var nextPage = function (next) {
        LOG.info('market: Grabbing data for `' + region.name + '#' + region.id + '` page ' + page++);
        if (!next) return cb();
        https.get(next, (res) => {
          var body = '';
          res.on('data', (d) => {
            body += d;
          });
          res.on('end', () => {
            try {
              body = JSON.parse(body);
            } catch (e) {
              console.log(body);
              throw e;
            }
            async.eachSeries(body.items, (item, itemsCB) => {
              redis.get(prefix + ':' + item.type, (err, reply) => {
                if (err) return LOG.warn('market: Error fetching existing market data!');
                if (!reply) reply = { };
                else reply = JSON.parse(reply);
                reply.update = reply.update || new Date().getTime();

                if (new Date().getTime() - reply.update > 1000 * 60 * 60 * (config.get('market:cacheTime') - 1)) return itemsCB();

                // TODO Need to remove orders that no longer exist.

                // Update item best
                reply.best = reply.best || {};
                if (item.buy && (!reply.best.buy || reply.best.buy.price < item.price))
                  reply.best.buy = { price: item.price, region: region.id, station: item.stationID };
                if (!item.buy && (!reply.best.sell || reply.best.sell.price > item.price))
                  reply.best.sell = { price: item.price, region: region.id, station: item.stationID };

                // Update the region.
                reply.regions = reply.regions || {};
                reply.regions[region.id] = reply.regions[region.id] || {};
                var ir = reply.regions[region.id];
                // Update region best
                ir.best = ir.best || {};
                if (item.buy && (!ir.best.buy || ir.best.buy.price < item.price))
                  ir.best.buy = { price: item.price, station: item.stationID };
                if (!item.buy && (!ir.best.sell || ir.best.sell.price > item.price))
                  ir.best.sell = { price: item.price, station: item.stationID };

                // Update station.
                ir.stations = ir.stations || {};
                ir.stations[item.stationID] = ir.stations[item.stationID] || {};
                var is = ir.stations[item.stationID];
                if (item.buy && (!is.buy || is.buy < item.price)) is.buy = item.price;
                if (!item.buy && (!is.sell || is.sell > item.price)) is.sell = item.price;
                is.orders = (is.orders || 0) + 1;

                redis.set(prefix + ':' + item.type, JSON.stringify(reply), function (err) {
                  if (err) LOG.warning('market: Failed save on ' + item.type, err);
                  itemsCB();
                  // I'm Cave Johnson. We're done here.
                });
              });
            }, () => {
              nextPage(body.next ? body.next.href : null);
            });
          });
        }).on('error', (e) => {
          LOG.warn('Failed to fetch some market orders!', e);
        }).setTimeout(5000);
      };
      nextPage(href);
    }, () => {
      LOG.info('All market data fetched!');
    });
  };
  marketFunc();
  return setInterval(marketFunc, 1000 * 60 * 60 * config.get('market:cacheTime'));
};
