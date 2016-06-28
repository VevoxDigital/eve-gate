'use strict';

// MongoDB connection module.

const mongoose  = require('mongoose'),
      config    = require('nconf'),
      q         = require('q');

exports = module.exports = () => {
  var deferred = q.defer();

  // Try to form a database connection.
  if (!config.get('db')) return deferred.reject(ENUM.CONFIG_SECTION_INVALID);
  const dbURL = `mongodb://${config.get('db:host')}:${config.get('db:port')}/${config.get('db:db')}`;
  mongoose.connect(dbURL, { }, (err) => {
    if (err) return deferred.reject(err);
    else deferred.resolve();
  });

  return deferred.promise;
};
