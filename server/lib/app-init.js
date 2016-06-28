'use strict';

// Web app init module.

const bodyParser  = require('body-parser'),
      q           = require('q');

exports = module.exports = (appdata) => {
  var deferred = q.defer();

  var app = appdata[0];
  var client = appdata[1];

  // Hook in middleware.
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    //res.setHeader('Access-Control-Allow-Credentials', true); // For session headers. Not currently needed.
    next();
  });
  app.use(bodyParser.json());
  app.use(function (req, res, next) {
    req.$redis = client;
    req.$database = require('./middleware/models')();
    next();
  });
  deferred.resolve(app);

  return deferred.promise;
};
