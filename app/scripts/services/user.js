'use strict';

/**
 * @ngdoc service
 * @name tech3App.user
 * @description
 * # user
 * Service in the tech3App.
 */
angular.module('tech3App')
  .service('$user', function ($http, $localStorage, $sessionStorage) {
    var user = this;
    user.logging = false;

    user.data = {};

    // Get the current user's token.
    user.token = function (token, remember) {
      if (token) {
        $sessionStorage.userToken = token;
        if (remember) {
          $localStorage.userToken = token;
        }
      } else {
        // Always prioritize the localStorage token if it exists.
        if ($localStorage.userToken) {
          $sessionStorage.userToken = $localStorage.userToken;
        }
        return $sessionStorage.userToken;
      }
    };

    user.isLogged = function () {
      return !!user.data.id;
    };

    // Create new user and fetch token.
    user.create = function (email, pass, cb) {
      $http({
        method: 'PUT',
        url: '/api/user',
        data: {
          email: email,
          pass: pass
        },
        timeout: 5000
      }).then(function (res) {
        user.token(res.data);
        user.fetch(res.data, cb);
      }, function (res) {
        switch (res.status) {
          // PUT on `/user` will return 400 on failure with string reason.
          case 400: return cb(res.data, 0);
          default: return cb(new Error(res.data));
        }
      });
    };

    // Fetch the user from token.
    user.fetch = function (token, cb) {
      $http({
        method: 'GET',
        url: '/api/user',
        params: { 'token': token },
        timeout: 5000
      }).then(function (res) {
        user.data = res.data;
        user.data.id = user.data._id;
        cb();
      }, function (res) {
        cb(new Error(res.data));
      });
    };

    // Fetch the token from email/pass.
    user.login = function (email, pass, remember, cb) {
      $http({
        method: 'POST',
        url: '/api/user',
        data: {
          email: email,
          pass: pass
        },
        timeout: 5000
      }).then(function (res) {
        user.token(res.data, remember);
        user.fetch(res.data, cb);
      }, function (res) {
        switch (res.status) {
          // POST on `/user` will return 401 on failure with string reason.
          case 401: return cb(res.data, 1);
          default: return cb(new Error(res.data));
        }
      });
    };

    return this;
  });
