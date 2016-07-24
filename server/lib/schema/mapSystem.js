'use strict';

const mongoose  = require('mongoose'),
      yaml      = require('js-yaml');

const Coordinate = new mongoose.Schema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  z: { type: Number, default: 0 }
}, { _id: false });

const MapSystemSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unqiue: true },
  center: { type: Coordinate, required: true },
  security: { type: Number, required: true, min: -1, max: 1 },
  constellation: { type: Number, required: true, ref: 'MapRegions' },
  region: { type: Number, required: true, ref: 'MapConstellations' },
  stargates: [{ type: Number, ref: 'MapSystems' }],
  stations: [{ type: Number, ref: 'StaStations' }]
});

exports = module.exports = MapSystemSchema;
