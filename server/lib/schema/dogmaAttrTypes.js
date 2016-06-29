'use strict';

var mongoose = require('mongoose');

const AttrSchema = new mongoose.Schema({
  _id: { type: Number, min: 0, unique: true, required: true },
  name: { type: String, match: /^[A-Z0-9_]*$/i, required: true },
  category: { type: Number, min: 0 },
  published: { type: Boolean, required: true },
  meta: {
    displayName: { type: String, default: '' },
    stackable: { type: Boolean, default: false },
    highIsGood: { type: Boolean, default: true },
    description: { type: String, default: '' },
    unit: { type: Number, ref: 'Unit' }
  }
});

exports = module.exports = AttrSchema;
