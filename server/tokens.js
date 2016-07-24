'use strict';

const jwt     = require('jsonwebtoken'),
      secret  = require('./secret'),
      q       = require('q');

const TOKEN_EXP = 60 * 60;
const TOKEN_PFX = 'token:';
const USER_PFX = 'tokens:';

exports = module.exports = function (client) {
  var tokens = this;
  tokens.create = function (user) {
    var deferred = q.defer();
    var token = jwt.sign({ id: user.id }, secret, { expiresIn: TOKEN_EXP });
    client.set(TOKEN_PFX + token, user.id, (err, reply) => {
      if (err) deferred.reject(err);
      else if (!reply) deferred.reject('No response from token cache');
      else client.expire(TOKEN_PFX + token, TOKEN_EXP, function (err, reply) {
        if (err) deferred.reject(err);
        else if (!reply) deferred.reject('No response from token cache');
        else deferred.resolve(token);
      });
    });
    return deferred.promise;
  };

  tokens.verify = function (token) {
    var deferred = q.defer();
    if (typeof token !== 'string') throw new Error('Token must be a string');
    jwt.verify(token, secret, (err, decoded) => {
      if (err) return deferred.reject(err);
      client.get(TOKEN_PFX + token, (err, reply) => {
        if (err) return deferred.reject(err);
        if (reply !== decoded.id) return deferred.reject('Invalid or expired token');
        deferred.resolve(decoded.id);
      });
    });
    return deferred.promise;
  };
  tokens.verifyM = function (force) {
    return function (req, res, next) {
      var token = req.query.token || req.params.token || req.body.token;
      if (!token) {
        if (force) return res.status(401).json({ message: 'User token required for route '});
        else return next();
      } else tokens.verify(token).then((id) => {
        req.$database.User.findById(id, (err, user) => {
          if (err) return res.status(500).send(err);
          else if (!user) res.status(404).json({ message: 'Unknown user ID from token' });
          else tokens.bump(token).then(() => {
            req.$user = user;
            next();
          }).catch((err) => {
            res.status(500).json(typeof err === 'string' ? { message: err } : err);
          });
        });
      }).catch((err) => {
        if (typeof err === 'string') return res.status(440).json({ message: err });
        else res.status(500).json(err);
      });
    };
  };

  tokens.bump = function (token) {
    var deferred = q.defer();
    client.expire(TOKEN_PFX + token, TOKEN_EXP, (err, reply) => {
      if (err) deferred.reject(err);
      else if (!reply) deferred.reject('No reply from database on token bump');
      else deferred.resolve();
    });
    return deferred.promise;
  };

  return this;
};
