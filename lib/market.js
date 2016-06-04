const config  = require('nconf'),
      async   = require('async'),
      https    = require('https');

const url = 'https://api-sisi.testeveonline.com/market/';
const prefix = 'market'

exports = module.exports = function (redis) {
  var marketFunc = () => {
    // Update the market data.
    LOG.info('Updating market data at ' + new Date().toString());
    async.eachLimit(config.get('dev') ? [REGIONS[1]] : REGIONS, 20, (region, cb) => {
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
                if (!reply || !reply.update || reply.update[region.id] - new Date().getTime() > 1000 * 60 * 60 * (config.get('market:cacheTime') - 1))
                  reply = { update: { }, buy: { }, sell: { } };
                else reply = JSON.parse(reply);

                var order = item.buy ? 'buy' : 'sell';
                if (!reply[order][region.id]
                  || (item.buy && reply[order][region.id] < item.price)
                  || (!item.buy && reply[order][region.id] > item.price)) {
                  reply[order][region.id] = { price: item.price, station: item.stationID };
                  reply.update[region.id] = new Date().getTime();
                  redis.set(prefix + ':' + item.type, JSON.stringify(reply), (err) => {
                    if (err) LOG.warn('market: Failed to save market data for ' + item.type + ' in ' + region.id, err);
                    itemsCB();
                  });
                } else {
                  itemsCB();
                }
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
