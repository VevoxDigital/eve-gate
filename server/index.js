'use strict';

const winston     = require('winston'),
      app         = require('express')(),
      server      = require('http').Server(app),
      io          = require('socket.io')(server),
      config      = require('nconf'),
      path        = require('path'),
      fs          = require('fs-extra'),
      mongoose    = require('mongoose'),
      bodyParser  = require('body-parser'),
      redis       = require('redis');

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

  if (!config.get('db')) {
    LOG.error('Invalid database configuration! Cannot continue!');
    APP.exit(ENUM.CONFIG_SECTION_INVALID);
  }
  const dbURL = 'mongodb://' + config.get('db:host') + ':' + config.get('db:port') + '/' + config.get('db:db');
  mongoose.connect(dbURL, {}, () => {
    LOG.info('Database connection successful');
    const client = redis.createClient();
    client.on('error', (err) => {
      LOG.error('Failed to connect to the redis database!', err);
      APP.exit(ENUM.REDIS_CONNECTION_FAILED);
    });
    client.on('connect', () => {
      LOG.info('Redis connection successful');

      app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // For session headers. Not currently needed.
        //res.setHeader('Access-Control-Allow-Credentials', true);

        next();
      });

      app.use(bodyParser.json());
      app.use(function (req, res, next) {
        req.$redis = client;
        req.$database = require('./middleware/models')();
        next();
      });

      var routers = 0;
      fs.walk(path.join(__dirname, 'routes'))
        .on('readable', function () {
          var item;
          while ((item = this.read())) {
            if (item.stats.isFile()) {
              LOG.info(' > Found router `' + path.basename(item.path).slice(0, -3) + '`');
              app.use('/api/' + path.basename(item.path).slice(0, -3), require(item.path));
              routers++;
            }
          }
        }).on('end', function () {
          LOG.info('Tied in ' + routers + ' router(s)');
          app.use('/', require('express').static(path.join(__dirname, '..', 'dist')));
          app.use('/public', require('express').static(path.join(__dirname, '..', 'public')));
          LOG.info('Static apps routed');

          server.listen(PORT);
          LOG.info(' ! App running on ' + PORT);

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
        });
    });
  });
};