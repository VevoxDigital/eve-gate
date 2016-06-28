'use strict';

const winston     = require('winston'),
      config      = require('nconf'),
      path        = require('path'),
      app         = require('express')(),
      server      = require('http').Server(app),
      io          = require('socket.io')(server),
      q           = require('q');

require('./const');

var marketInterval;

exports = module.exports = () => {
  // TODO Use `winston-daily-rotate-file` to log to file.
  global.LOG = new winston.Logger({ transports: [
      new winston.transports.Console()
  ] });
  LOG.info('Logger init ok, configuration data init start');

  config.argv().env().file({
    file: path.join(__dirname, '..', 'cfg', 'config.json')
  });
  global.PORT = config.get('port') || 3000;

  var client;
  q.fcall(require('./lib/db-mongo')) // Connect to MongoDB
    .then(require('./lib/db-redis')) // Connect to Redis
    .then((redis) => { // Done with databases, start init on the app.
      var deferred = q.defer();
      LOG.info('Databases successfully connected, starting the app!');
      client = redis;
      deferred.resolve([app,client]);
      return deferred.promise;
    })
    .then(require('./lib/app-init')) // Init app, hook middleware
    .then(require('./lib/app-routers')) // Hook routers to app. TODO Write routers.
    .then(() => {
      server.listen(PORT);
      LOG.info(`App running on ${PORT}`);
      // Inject the market object into global scope.
      // This is done here instead of `const.js` because of the needed `client`.
      global.MARKET = new (require('./market'))(client);

      // Start market update ticker.
      var ticker = () => {
        require('./market-updater')(client)
          .catch((err) => {
            LOG.warn('Market updater failed to finish execution:');
            LOG.warn(err);
          }).then((skipped) => {
            LOG.info('Market update finished.' + (!skipped ? '' : ` Skipped ${skipped} of ${REGIONS.length} regions.`));
          });
      };
      ticker();
      marketInterval = setInterval(ticker, MARKET_TIME_MS); // TODO Clear this interval at some point?
    })
    .catch((err) => {
      LOG.error('An error has occured during startup:');
      LOG.error(err);
    });
};
