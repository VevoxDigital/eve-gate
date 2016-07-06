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
  buy: { type: Number, default: 0 },
  sell: { type: Number, default: 0 },
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
    est: { adjustedPrice: { type: Number, default: 0 }, averagePrice: { type: Number, default: 0 } },
    jita: MarketGraphData,
    amarr: MarketGraphData,
    dodixie: MarketGraphData,
    rens: MarketGraphData,
    hek: MarketGraphData
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

TypeSchema.methods.needsGraphUpdate = function () {
  return !this.market.jita.length || new Date().getTime() - this.market.jita[0].time.getTime() >= MARKET_TIME_MS - (60 * 60 * 1000);
};

TypeSchema.methods.updateMarket = function (market, order) {
  this.market[market].unshift({
    buy: order && order.buy ? order.buy.price : 0,
    sell: order && order.sell ? order.sell.price : 0
  });
  if (this.market[market].length > MAX_MARKET_LENGTH)
    this.market[market].splice(-1, this.market[market].length - MAX_MARKET_LENGTH);
  this.markModified('market.' + market);
};

exports = module.exports = TypeSchema;
