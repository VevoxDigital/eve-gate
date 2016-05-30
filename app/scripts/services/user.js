'use strict';

/**
 * @ngdoc service
 * @name eveGateApp.user
 * @description
 * # user
 * Service in the eveGateApp.
 */
angular.module('eveGateApp')
  .service('$user', function ($http) {
    var user = this;
    user.logging = false;

    user.data = {};

    user.isLogged = function () {
      return !!user.data.id;
    };

    // Create new user and fetch token.
    user.create = function (email, pass, cb) {
      $http({
        method: 'PUT',
        url: '/user',
        data: {
          email: email,
          pass: pass
        },
        timeout: 5000
      }).then(function (res) {
        user.token = res.data;
        user.fetch(res.data, cb);
      }, function (res) {
        switch (res.status) {
          // PUT on `/user` will return 400 on failure with string reason.
          case 400: return cb(res.data);
          default: return cb(new Error(res.data));
        }
      });
    };

    // Fetch the user from token.
    user.fetch = function (token, cb) {
      $http({
        method: 'GET',
        url: '/user',
        params: 'token='+token
      }).then(function (res) {
        user.data = res.data;
        cb();
      }, function (res) {
        cb(new Error(res.data));
      });
    };

    // Fetch the token from email/pass.
    user.login = function (email, pass, cb) {

    };

    return this;
  });
