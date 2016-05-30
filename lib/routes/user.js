const router = require('express').Router(),
      tokens = require('../tokens');

// Get from token
router.get('/', tokens.verify, (req, res) => {
  res.send(req.$user);
});

// Create new user
router.put('/', (req, res, next) => {
  if (req.query.email && req.query.pass) {
    req.$database.User.findByEmail(email, function (err, user) {
      if (err) return next(err);
      else if (user) return res.status(400).send('Email already in use');
      else {
        user = new req.$database.User();
        user.login = {
          email: req.query.email,
          pass: req.query.pass
        };
        user.save(function (err) {
          if (err) return next(err);
          else tokens.create(req.$redis, user, function (err, token) {
            if (err) return next(err);
            else res.send(token);
          });
        });
      }
    });
  } else res.status(400).send('Must provide email and password');
});

// Get from user/pass
router.post('/', (req, res, next) => {
  const loginMsg = 'Incorrect email or password';
  if (req.query.email && req.query.pass) {
    req.$database.User.findByEmail(email, function (err, user) {
      if (err) return next(err);
      if (!user) return res.status(401).send(loginMsg);
      tokens.create(req.$redis, user, function (err, token) {
        if (err) return next(err);
        else res.send(token);
      });
    });
  } else res.status(401).send(loginMsg);
});

// logout
router.delete('/', (req, res, next) => {
  req.$redis.set(req.query.token, null, function (err, reply) {
    if (err) return next(err);
    else if (!reply) return next(new Error('Failed to delete token'));
    else res.send('ok');
  });
});

module.exports = router;
