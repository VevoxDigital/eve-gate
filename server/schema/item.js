'use strict';

const mongoose  = require('mongoose');

const AttrSchema = new mongoose.Schema({
  _id: { type: Number, min: 0, required: true },
  value: { type: Number, required: true }
  // TODO Units?
});

const ItemSchema = new mongoose.Schema({
  _id: { type: Number, min: 0, unique: true, required: true },
  name: { type: String, required: true },
  meta: {
    mass: Number,
    volume: Number,
    radius: Number,
    description: String,
    attributes: { type: [AttrSchema], default: [] }
  },
  published: { type: Boolean, required: true },
  group: { type: Number, min: 0, required: true }
});

exports = module.exports = ItemSchema;