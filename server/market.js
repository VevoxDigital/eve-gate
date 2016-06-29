'use strict';

const q     = require('q'),
      async = require('async');

const regionPrefix = 'region_';

function validOrderType(order) {
  return order === 'buy' || order === 'sell';
}

function assertOrderType(order) {
  if (!validOrderType) throw new Error(`Invalid order type '${order}'`);
}

// Regions to estimate price with.
// The Forge, Sinq Laison, Metropolis, Domain
const estimateRegions = [ 2, 26, 36, 37 ];

exports = module.exports = function (redis) {
  var market = this;

  market.put = function (regionID, pages) {
    var deferred = q.defer(), region = { buy: [], sell: [] };
    var p = 1;
    async.eachSeries(pages, (page, cb) => {
      if (!page.items) {
        deferred.reject(page);
        return cb('err');
      };
      var c = 1;
      page.items.forEach((item) => {
        region[item.buy ? 'buy' : 'sell'].push({
          price: item.price,
          type: item.type,
          station: item.stationID,
          volume: item.volume
        });
      });
      cb();
    }, () => {
      redis.set(regionPrefix + regionID, JSON.stringify(region), (err) => {
        if (err) return deferred.reject(err);
        redis.set(regionPrefix + regionID + '_ts', new Date().getTime(), (err) => {
          if (err) return deferred.reject(err);
          deferred.resolve();
        });
      });
    });
    return deferred.promise;
  };

  market.get = function (region, item) {
    var deferred = q.defer();
    if (item) {
      // Get a specific item.
      redis.get(regionPrefix + region, (err, data) => {
        if (err) return deferred.reject(err);
        var filter = (i) => { return i.type === item };
        data = JSON.parse(data);
        data.buy = data.buy.filter(filter);
        data.sell = data.sell.filter(filter);
        deferred.resolve(data);
      });
    } else {
      // Get all items.
      redis.get(regionPrefix + region, (err, data) => {
        if (err) return deferred.reject(err);
        else deferred.resolve(JSON.parse(data));
      });
    }
    return deferred.promise;
  };

  market.getBest = function (region, item, count) {
    var deferred = q.defer();
    market.get(region, items)
      .catch(deferred.reject)
      .then((data) => {
        data.buy.sort((a, b) => { return b.price - a.price });
        data.sell.sort((a, b) => { return a.price - b.price });
        if (count) {
          data.buy = data.buy.slice(0, count);
          data.sell = data.sell.slice(0, count);
          if (count === 1) {
            data.buy = data.buy[0];
            data.sell = data.sell[0];
          }
        }
        deferred.resolve(data);
      });
    return deferred.promise;
  };

  market.getStation = function (stationID, item) {
    var deferred = q.defer();

    // TODO Lookup station IDs in real DB entry.
    var stationIDTable = {
      60003760: 10000002, // Jita
      60008494: 10000043, // Amarr
      60011866: 10000032, // Dodi
      60005686: 10000042, // Hek
      60004594: 10000030  // Rens
    }
    market.get(stationIDTable[stationID], item)
      .catch(deferred.reject)
      .then((orders) => {
        var filter = (order) => { return order.stationID === stationID; };
        orders.buy = orders.buy.filter(filter);
        orders.sell = orders.sell.filter(filter);
        deferred.resolve(orders);
      });

    return deferred.promise;
  };

  market.getStationBest = function (stationID, item, count) {
    var deferred = q.defer();

    market.getStation(stationID, item)
      .catch(deferred.reject)
      .then((data) => {
        data.buy.sort((a, b) => { return b.price - a.price });
        data.sell.sort((a, b) => { return a.price - b.price });
        if (count) {
          data.buy = data.buy.slice(0, count);
          data.sell = data.sell.slice(0, count);
          if (count === 1) {
            data.buy = data.buy[0];
            data.sell = data.sell[0];
          }
        }
        deferred.resolve(data);
      });

    return deferred.promise;
  };

  market.getEstimate = function (item) {
    var deferred = q.defer();

    // Estimate price by averaging the estimate regions.
    var sum = { buy: 0, sell: 0 }, count = { buy: 0, sell: 0 };
    async.each(estimateRegions, (r, cb) => {
      r = REGIONS[r].id;
      market.getBest(r, item)
        .catch(deferred.reject)
        .then((best) => {
          sum.buy += best.buy;
          sum.sell += best.sell;
          count.buy++;
          count.sell++;
          cb();
        });
    }, () => {
      sum.buy = Math.floor(sum.buy/count.buy);
      sum.sell = Math.floor(sum.sell/count.sell);
      deferred.resolve(sum);
    });

    return deferred.promise;
  };

  return this;
};
