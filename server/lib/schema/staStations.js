'use strict';

const mongoose  = require('mongoose'),
      yaml      = require('js-yaml');

const OrderedTriple = new mongoose.Schema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  z: { type: Number, default: 0 }
}, { _id: false });

const StaStationSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unqiue: true },
  position: { type: OrderedTriple, required: true },
  name: { type: String, required: true },
  typeID: { type: Number, required: true, ref: 'StaStationTypes' },
  security: { type: Number, required: true, min: -1, max: 1 },
  corporation: { type: Number, required: true }

  system: { type: Number, required: true, ref: 'MapSystems' }, // eslint-disable-line
  constellation: { type: Number, required: true, ref: 'MapConstellations' },
  region: { type: Number, required: true, ref: 'MapRegions' }
});

exports = module.exports = StaStationSchema;
