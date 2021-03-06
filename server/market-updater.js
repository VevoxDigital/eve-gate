'use strict';

const config  = require('nconf'),
      async   = require('async'),
      https   = require('https'),
      q       = require('q');

const url = CREST_URL + '/market';
const prefix = 'market';

const db = require('./lib/middleware/models')();

exports = module.exports = (redis) => {
  var deferred = q.defer();
  LOG.info('Starting market data updater...');
  const timestamp = new Date().getTime();
  var skipped = 0;
  async.eachSeries(REGIONS, (region, done) => {
    redis.get(`region_${region.id}_ts`, (err, regionTimestamp) => {
      if (err) return done(err);
      regionTimestamp = regionTimestamp || 0;
      // Don't use global market variable, trying to fetch time minus one.
      if (!config.get('force-market') && timestamp - regionTimestamp <= (MARKET_TIME - 1) * 60 * 60 * 1000) {
        skipped++;
        done();
      } else {
        LOG.info(`Updating ${region.name}#${region.id}:`);
        LOG.info(' * Downloading market data...');
        var regionUrl = `${url}/${region.id}/orders/all/`;
        var fetchPage = (pageNum) => {
          var deferredHTTP = q.defer(), pageUrl = pageNum ? regionUrl + `?page=${pageNum}` : regionUrl;
          https.get(pageUrl, (res) => {
            var body = '';
            res.on('data', (d) => { body += d });
            res.on('end', () => {
              try {
                deferredHTTP.resolve(JSON.parse(body));
              } catch (e) {
                deferredHTTP.reject(e);
              }
            })
          });
          return deferredHTTP.promise;
        };

        // Get the first page so we have the total page count.
        fetchPage().catch(done).then((json) => {
          var pages = [json], pageNums = [];
          for (var n = 2; n <= json.pageCount; n++) pageNums.push(n);
          // Now start getting the other pages.
          async.each(pageNums, (page, cb) => {
            fetchPage(page).catch(done).then((body) => {
              pages.push(body);
              cb();
            });
          }, () => {
            LOG.info(` * Parsing ${pages.length} page${pages.length === 1 ? '' : 's'}...`);
            MARKET.put(region.id, pages)
              .catch((err) => {
                LOG.error(' *  ! Failed to insert market data: ' + err);
                done(err);
              }).then(done);
          });
        });
      }
    });
  }, (err) => {
    if (err) deferred.reject(err);
    else {
      LOG.info(`Regional data up-to-date (${skipped} skipped), updating type data...`);

      var fetchMarket = () => {
        var deferredHTTP = q.defer();
        https.get(`${url}/prices/`, (res) => {
          var body = '';
          res.on('data', (d) => { body += d; });
          res.on('end', () => {
            try {
              deferredHTTP.resolve(JSON.parse(body));
            } catch (e) { deferredHTTP.reject(e); }
          });
        });
        return deferredHTTP.promise;
      };

      fetchMarket().catch(deferred.reject).then((marketPrices) => {
        var c = 0;
        async.eachSeries(marketPrices.items, (item, cb) => {
          var typeID = item.type.id;
          db.Type.findById(typeID)
            .select('market')
            .exec((err, type) => {
              if (err) return deferred.reject(err);
              process.stdout.clearLine();
              process.stdout.cursorTo(0);
              process.stdout.write(` * Importing type ${typeID} (#${c++}) of ${marketPrices.items.length}`);
              if (!type || !type.needsGraphUpdate()) return cb();

              q.all([
                MARKET.getStationBest(60003760, typeID),
                MARKET.getStationBest(60008494, typeID)
                //MARKET.getStationBest(60011866, typeID),
                //MARKET.getStationBest(60005686, typeID),
                //MARKET.getStationBest(60004594, typeID)
              ])
              .catch(cb)
              .then((results) => {
                try {
                  type.updateMarket('jita', results[0]);
                  type.updateMarket('amarr', results[1]);
                  type.market.est = { adjustedPrice: item.adjustedPrice, averagePrice: item.averagePrice }
                  type.save(cb);
                } catch (e) { console.log(e); }
              });
            });
        }, (err) => {
          if (err) deferred.reject(err);
          else { console.log(); deferred.resolve(skipped); }
        });
      });
    }
  });
  return deferred.promise;
}
