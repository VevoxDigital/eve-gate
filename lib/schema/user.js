'use strict';

const mongoose = require('mongoose'),
      bcrypt   = require('bcrypt-nodejs');

const UserSchema = new mongoose.Schema({
  login: {
    email:  { type: String, match: /^[^@]+@[^@]+$/i, required: true, unique: true },
    pass:   { type: String }
  }
});

UserSchema.methods.updatePass = function (pass) {
  this.login.pass = bcrypt.hashSync(pass);
};
UserSchema.methods.checkPass = function (pass) {
  return bcrypt.compareSync(pass, this.login.pass);
};

UserSchema.statics.findByEmail = function (email, cb) {
  return this.find({ 'login.email': email }, cb);
};
UserSchema.statics.create = function (email, pass, cb) {
  this.findByEmail(email).exec(function (err, users) {
    if (err) {
      cb(err);
    } else if (users.length > 0) {
      cb(new Error('EMail already in use.'));
    } else {
      var user = new this();
      user.login.email = email;
      user.updatePass(pass);
      user.save(cb);
    }
  });
};

exports = module.exports = UserSchema;
