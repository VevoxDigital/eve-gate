'use strict';

const mongoose  = require('mongoose');

var UnitSchema = new mongoose.Schema({
  _id: { type: Number, min: 0, unique: true, required: true },
  name: { type: String, required: true },
  description: String,
  displayName: String
});

exports = module.exports = UnitSchema;
