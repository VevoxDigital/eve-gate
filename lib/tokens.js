'use strict';

const jwt     = require('jsonwebtoken'),
      secret  = require('./secret');

const TOKEN_EXP = 60, TOKEN_EXP_S = TOKEN_EXP * 60;

exports = module.exports = {
  create: function (client, user, cb) {
    var token = jwt.sign({ id: user.id }, secret, {
      expiresInMinutes: TOKEN_EXP
    });
    client.set(token, user.id, function (err, reply) {
      if (err) return cb(err);
      else if (reply) {
        client.expire(token, TOKEN_EXP_S, function (err, reply) {
          if (err) return cb(err);
          else if (reply) return cb(null, token);
          else return cb(new Error('Failed to set token expiration'));
        });
      } else return cb(new Error('Failed to set token'));
    });
  },
  verify: function (req, res, next) {
    if (req.query.token || req.params.token) {
      jwt.verify(req.query.token || req.params.token, secret, function (err, decoded) {
        if (err) return next(err);
        else {
          req.$redis.get(token, function (err, reply) {
            if (err) return next(err);
            else {
              if (JSON.parse(reply) === decoded.id) {
                req.$database.User.findById(decoded.id, function (err, user) {
                  if (err) return next(err);
                  else if (!user) return res.status(400).send('Unknown or deleted user');
                  else { delete user.login.pass; req.$user = user; }
                  next();
                });
              } else {
                res.status(401).send('Incorrect or invalid token');
              }
            }
          });
        }
      });
    } else res.status(401).send('Missing token in request');
  },
  bump: function (req, res, next) {
    if (req.query.token) {
      req.$redis.expire(req.query.token, TOKEN_EXP_S, function (err, reply) {
        if (err) return next(err);
        else if (reply) return next();
        else return next(new Error('No database reply for token bump'));
      });
    }
  }
};
