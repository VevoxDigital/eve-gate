'use strict';

const mongoose  = require('mongoose'),
      q         = require('q');

const MAX_MARKET_LENGTH = 4 * 7 * 2; // Two weeks of data.

// Schema for attributes.
const AttributeSchema = new mongoose.Schema({
  attribute: { type: Number, ref: 'DogmaAttrTypes' },
  value: Number
}, { _id: false });

const MarketGraphEntrySchema = new mongoose.Schema({
  value: { type: Number, default: 0 },
  time: { type: Date, default: new Date() }
}, { _id: false });

// Object for market graph data.
var marketArrayValidator = (val) => { return val.length <= MAX_MARKET_LENGTH; };
const MarketGraphData = {
  type: [MarketGraphEntrySchema],
  default: [],
  validate: [marketArrayValidator, 'Market array should not exceed ' + MAX_MARKET_LENGTH]
};

// Schema for type itself.
const TypeSchema = new mongoose.Schema({
  _id: { type: Number, min: 0, unique: true, required: true },
  name: { type: String, required: true },
  meta: {
    mass: Number,
    volume: Number,
    radius: Number,
    description: String,
    attributes: { type: [AttributeSchema], default: [] }
  },
  market: {
    est: { buy: MarketGraphData, sell: MarketGraphData },
    jita: { buy: MarketGraphData, sell: MarketGraphData },
    amarr: { buy: MarketGraphData, sell: MarketGraphData },
    dodixie: { buy: MarketGraphData, sell: MarketGraphData },
    rens: { buy: MarketGraphData, sell: MarketGraphData },
    hek: { buy: MarketGraphData, sell: MarketGraphData }
  },
  published: { type: Boolean, required: true },
  group: { type: Number, min: 0, required: true }
});

TypeSchema.statics.getMaxID = function () {
  var deferred = q.defer();

  this.find()
    .where('_id').lt(300000) // Going to ignore Dust stuff.
    .sort('-_id')
    .select('_id')
    .limit(1)
    .exec((err, max) => {
      if (err) deferred.reject(err);
      else deferred.resolve(max[0]._id);
    });

  return deferred.promise;
};

TypeSchema.methods.updateGraphData = function (market, orderType, value) {
  this.market[market][orderType].unshift({ value: value });
  if (this.market[market][orderType].length > MAX_MARKET_LENGTH)
    this.market[market][orderType] =
      this.market[market][orderType].slice(MAX_MARKET_LENGTH - this.market[market][orderType].length);
  this.markModified('market.' + market);
};

TypeSchema.methods.updateMarket = function (market, order) {
  this.updateGraphData(market, 'buy', order && order.buy ? order.buy.price : 0);
  this.updateGraphData(market, 'sell', order && order.sell ? order.sell.price : 0);
};

TypeSchema.methods.updateEstGraphData = function (orderType) {
  var est = 0, count = 0;
  var updateEst = (type, station) => {
    if (type.market[station][orderType][0]) {
      est += type.market[station][orderType][0];
      count++;
    }
  }
  updateEst(this, 'jita');
  updateEst(this, 'amarr');
  updateEst(this, 'dodixie');
  updateEst(this, 'rens');
  updateEst(this, 'hek');

  // Why does this work? It's not even correct?
  // Correct way doesn't work. Black magic again.
  this.market.est[orderType].unshift(Math.floor(est/count));
  this.markModified('market.est');
};

TypeSchema.methods.updateEstimate = function () {
  this.updateEstGraphData('buy');
  this.updateEstGraphData('sell');
};

exports = module.exports = TypeSchema;
