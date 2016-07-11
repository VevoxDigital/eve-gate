'use strict';

var mongoose = require('mongoose');

var InvTypeReactionComponentSchema = new mongoose.Schema({
  typeID: { type: Number, required: true, min: 0, ref: 'Unit' },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

var InvTypeReactionSchema = new mongoose.Schema({
  _id: { type: Number, required: true, min: 0, unique: true, ref: 'Unit' },
  input: [InvTypeReactionComponentSchema],
  output: InvTypeReactionComponentSchema
});

exports = module.exports = InvTypeReactionSchema;
