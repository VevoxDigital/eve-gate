'use strict';

const config  = require('nconf'),
      async   = require('async'),
      https   = require('https'),
      q       = require('q');

const url = CREST_URL + '/market';
const prefix = 'market';


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
      if (timestamp - regionTimestamp <= (MARKET_TIME - 1) * 60 * 60 * 1000) {
        skipped++;
        done();
      } else {
        LOG.info(`Updating ${region.name}#${region.id}:`);
        LOG.info(' * Downloading market data...');
        var regionUrl = `${url}/${region.id}/orders/all/`;
        var fetchPage = (pageNum) => {
          var deferredHTTP = q.defer(), pageUrl = !!pageNum ? regionUrl + `?page=${pageNum}` : regionUrl;
          https.get(regionUrl, (res) => {
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
          for (var n = 1; n < json.pageCount; n++) pageNums.push(n);
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
  }, (err) => { if (err) deferred.reject(err); else deferred.resolve(skipped); });
  return deferred.promise;
}
