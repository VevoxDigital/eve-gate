'use strict';

// Redis connection module.

const redis = require('redis'),
      q     = require('q');

exports = module.exports = () => {
  var deferred = q.defer();

  // Try to form a redis connection.
  const client = redis.createClient();
  client.on('error', (err) => { deferred.reject(err); });
  client.on('connect', () => { deferred.resolve(client); });

  return deferred.promise;
};
