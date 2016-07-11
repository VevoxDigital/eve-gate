'use strict';

var mongoose = require('mongoose');

var InvTypeMaterialComponentSchema = new mongoose.Schema({
  typeID: { type: Number, required: true, min: 0, ref: 'Unit' },
  quantity: { type: Number, required: true, min: 0 }
}, { _id: false });

var InvTypeMaterialSchema = new mongoose.Schema({
  _id: { type: Number, required: true, unique: true, ref: 'Unit' },
  minerals: [InvTypeMaterialComponentSchema]
});

InvTypeMaterialSchema.statics.findWithMineral = (mineralID) => {
  return this.find({ 'minerals.typeID': mineralID });
};

exports = module.exports = InvTypeMaterialSchema
