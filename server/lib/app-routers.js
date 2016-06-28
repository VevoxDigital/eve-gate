'use strict';

const q     = require('q'),
      fs    = require('fs-extra'),
      path  = require('path');

exports = module.exports = (app) => {
  var deferred = q.defer();

  var routers = 0;
  fs.walk(path.join(__dirname, 'routes'))
    // Can't use a lambda here. For some reason `this` fails.
    .on('readable', function () {
      var item;
      while ((item = this.read())) {
        if (item.stats.isFile()) {
          LOG.info(` * Found router '${path.basename(item.path).slice(0, -3)}'`);
          app.use('/api/' + path.basename(item.path).slice(0, -3), require(item.path));
          routers++;
        }
      }
    })
    .on('error', (err) => { deferred.reject(err); })
    .on('end', () => {
      app.use('/', require('express').static(path.join(__dirname, '..', 'dist')));
      app.use('/public', require('express').static(path.join(__dirname, '..', 'public')));
      deferred.resolve(app);
    });

  return deferred.promise;
};
