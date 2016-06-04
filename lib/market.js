const config = require('nconf');

exports = module.exports = setInterval(function () {
  // Update the market data.
  // TODO
}, 1000 * 60 * 60 * config.get('market:cacheTime'));
