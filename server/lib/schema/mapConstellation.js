'use strict';

const mongoose  = require('mongoose'),
      yaml      = require('js-yaml');

const Coordinate = new mongoose.Schema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  z: { type: Number, default: 0 }
}, { _id: false });

const MapConstellationSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true },
  center: { type: Coordinate, required: true },
  name: { type: String, required: true },
  region: { type: Number, required: true, ref: 'MapRegions' }
  systems: [{ type: Number, ref: 'MapSystems' }]
});

exports = module.exports = MapConstellationSchema;
