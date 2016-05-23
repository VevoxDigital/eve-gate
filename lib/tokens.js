'use strict';

const jwt     = require('jsonwebtoken'),
      secret  = require('./secret');

const TOKEN_EXP = 60, TOKEN_EXP_S = TOKEN_EXP * 60;

exports = module.exports = (client) => {
  return {
    create: function (user, cb) {
      var token = jwt.sign({ id: user.id }, secret, {
        expiresInMinutes: TOKEN_EXP
      });
      client.set(data.token, user.id, function (err, reply) {
        if (err) return cb(err);
        else if (reply) {
          client.expire(data.token, TOKEN_EXP_S, function (err, reply) {
            if (err) return cb(err);
            else if (reply) return cb();
            else return cb(new Error('Failed to set token expiration'));
          });
        } else return cb(new Error('Failed to set token'));
      });
    },
    verify: function (req, res, next) {
      if (req.query.token) {
        jwt.verify(req.query.token, secret, function (err, decoded) {
          if (err) return next(err);
          else {
            client.get(token, function (err, reply) {
              if (err) return next(err);
              else {
                if (JSON.parse(reply) === decoded.id) {
                  req.$database.User.findById(decoded.id, function (err, user) {
                    if (err) return next(err);
                    else if (!user) return res.status(400).send('Unknown or deleted user');
                    else req.$user = user;
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
    }
  };
};
