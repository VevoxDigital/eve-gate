'use strict';

const mongoose  = require('mongoose'),
      yaml      = require('js-yaml'),
      q         = require('q');

const Coordinate = new mongoose.Schema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  z: { type: Number, default: 0 }
}, { _id: false });

const MapRegionSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true },
  center: { type: Coordinate, required: true },
  name: { type: String, required: true },
  constellations: [{ type: Number, ref: 'MapConstellations' }],
  faction: { type: Number },
  classID: { type: Number }
});

MapRegionSchema.methods.isWormhole = () => {
  return !isNaN(this.classID);
};

exports = module.exports = MapRegionSchema;
