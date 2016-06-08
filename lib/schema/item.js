'use strict';

const mongoose  = require('mongoose'),
      http      = require('https'),
      async     = require('async');

const ItemSchema = new mongoose.Schema({
  _id: { type: Number, min: 0, unique: true, required: true },
  name: { type: String, required: true },
  meta: {
    mass: Number,
    volume: Number,
    radius: Number,
    description: String
  },
  published: { type: Boolean, required: true },
  group: { type: Number, min: 0, required: true }
});

exports = module.exports = ItemSchema;
