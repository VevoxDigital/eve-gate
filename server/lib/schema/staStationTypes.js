'use strict';

const mongoose  = require('mongoose'),
      yaml      = require('js-yaml');

const OrderedTriple = new mongoose.Schema({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  z: { type: Number, default: 0 }
}, { _id: false });

const StaStationTypeSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unqiue: true },
  dockPoint: { type: OrderedTriple, required: true },
  dockVector: { type: OrderedTriple, required: true },
  conquerable: { type: Boolean, required: true, default: false }
});

exports = module.exports = StaStationTypeSchema;
