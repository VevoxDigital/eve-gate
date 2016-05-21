'use strict';

const winston     = require('winston'),
      app         = require('express')(),
      server      = require('http').Server(app),
      io          = require('socket.io')(server),
      config      = require('nconf'),
      path        = require('path'),
      fs          = require('fs-extra'),
      mongoose    = require('mongoose'),
      bodyParser  = require('body-parser');

require('./const');

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
    LOG.info('Database ' + dbURL + ' connection successful');
    var routers = 0;
    fs.walk(path.join(__dirname, 'routes'))
      .on('readable', function () {
        var item;
        while ((item = this.read())) {
          if (item.stats.isFile()) {
            LOG.info(' > Found router `' + path.basename(item.path).slice(0, -3) + '`');
            app.use('/' + path.basename(item.path).slice(0, -3), require(item.path));
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
      });
  });
};
