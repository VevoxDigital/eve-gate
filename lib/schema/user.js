'use strict';

const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  login: {
    email:  { type: String, match: /^[^@]+@[^@]+$/i, required: true, unique: true },
    pass:   { type: String, required: true }
  }
});

UserSchema.pre('save', function (next) {
  if (this.isModified('login.pass') || this.isNew) {
    this.login.pass = bcrypt.hashSync(pass);
    return next();
  } else {
    return next();
  }
});
UserSchema.methods.checkPass = function (pass) {
  return bcrypt.compareSync(pass, this.login.pass);
};

UserSchema.statics.findByEmail = function (email, cb) {
  return this.find({ 'login.email': email }, cb);
};
UserSchema.statics.create = function (email, pass, cb) {
  this.findByEmail(email).exec(function (err, users) {
    if (err) {
      return cb(err);
    } else if (users.length > 0) {
      return cb(new Error('EMail already in use.'));
    } else {
      var user = new this();
      user.login.email = email;
      user.updatePass(pass).save(cb);
    }
  });
};
UserSchema.statics.login = function (email, pass, cb) {
  const loginError = new Error('EMail/Password does not exist');
  this.findByEmail(email)
    .select('login')
    .limit(1)
    .exec(function (err, users) {
      if (err) {
        return cb(err);
      } else if (users.length !== 1) {
        return cb(loginError);
      } else {
        var user = users[0];
        if (user.checkPass(pass)) {
          return cb(null, user);
        } else {
          return cb(loginError);
        }
      }
    });
};

exports = module.exports = UserSchema;
