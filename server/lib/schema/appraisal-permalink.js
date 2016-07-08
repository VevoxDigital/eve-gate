'use strict';

const mongoose  = require('mongoose');

var AppraisalPermalinkItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

var AppraisalPermalinkSchema = new mongoose.Schema({
  items: { type: [AppraisalPermalinkItemSchema], required: true }
});

exports = module.exports = AppraisalPermalinkSchema;
