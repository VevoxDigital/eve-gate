'use strict';

const mongoose  = require('mongoose');

const MAX_MARKET_LENGTH = 4 * 7 * 2; // Two weeks of data.

// Schema for attributes.
const AttributeSchema = new mongoose.Schema({
  attribute: { type: Number, ref: 'DogmaAttrTypes' },
  value: Number
}, { _id: false });

// Object for market graph data.
var marketArrayValidator = (val) => { return val.length <= MAX_MARKET_LENGTH; };
const MarketGraphData = { type: [Number], default: [], validate: [marketArrayValidator, 'Market array should not exceed ' + MAX_MARKET_LENGTH] };

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
    est: MarketGraphData,
    jita: MarketGraphData,
    amarr: MarketGraphData,
    dodixie: MarketGraphData,
    rens: MarketGraphData,
    hek: MarketGraphData
  },
  published: { type: Boolean, required: true },
  group: { type: Number, min: 0, required: true }
});

exports = module.exports = TypeSchema;
