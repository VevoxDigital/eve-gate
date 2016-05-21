'use strict';

const mongoose = require('mongoose'),
      _        = require('lodash');

exports = module.exports = () {
  var models = { $schema: require('../schema') };
  _.forEach(models.$schema, function (schema, name) {
    models[name] = mongoose.model(name, schema);
  });
  return models;
};
