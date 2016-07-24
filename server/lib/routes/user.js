'use strict';

const router  = require('express').Router();

var loginResponse = function (res, user) {
  TOKENS.create(user).then((token) => {
    res.json({ token: token, uid: user._id });
  }).catch((err) => {
    res.status(500).json(typeof err === 'string' ? { message: err } : err);
  });
};

// PUT `/`: Create new user.
router.put('/', (req, res, next) => {
  if (typeof req.body.email === 'string' && typeof req.body.password === 'string') {
    req.$database.User.create(req.body.email, req.body.password).then((user) => {
      loginResponse(res, user);
    }).catch((err) => {
      if (typeof err === 'string') res.status(400).json({ message: err });
      else res.status(500).json(err);
    });
  } else res.status(449).json({ message: 'Missing or invalid address/password'});
});

// POST `/`: Login existing user.
router.post('/', (req, res, next) => {
  if (typeof req.body.email === 'string' && typeof req.body.password === 'string')
    req.$database.User.login(req.body.email, req.body.password).then((user) => {
      loginResponse(res, user);
    }).catch((err) => {
      if (typeof err === 'string') res.status(404).json({ message: err });
      else res.status(500).json(err);
    });
  else res.status(449).json({ message: 'Missing or invalid address/password'});
});

// GET `/`: Get user data from token or ID.
router.get('/', TOKENS.verifyM(false), (req, res, next) => {
  if (req.$user) res.json(req.$user.toSendableObject(true));
  else if (req.query.id) {
    req.$database.User.findById(req.query.id, (err, user) => {
      if (err) return res.status(500).json(err);
      if (!user) return res.status(404).json({ message: 'No user with given ID '});
      res.json(user.toSendableObject(false));
    });
  } else res.send(400).json({ message: 'Must provide token or user ID '});
});


exports = module.exports = router;
