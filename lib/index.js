'use strict';

const winston     = require('winston'),
      app         = require('express')(),
      server      = require('http').Server(app),
      io          = require('socket.io')(server),
      config      = require('nconf'),
      path        = require('path');

exports = module.exports = () => {
  // TODO Use `winston-daily-rotate-file` to log to file.
  global.LOG = new winston.Logger({ transports: [
      new winston.transports.Console()
  ] });
  LOG.info('Logger init ok, configuration data init start');

  config.argv().env().file({
    file: path.join(__dirname, 'cfg', 'config.json');
  });
  global.PORT = config.get('port') || 3000;
  server.listen(PORT);
  LOG.info('Config loaded and app running on ' + PORT);

  
};
