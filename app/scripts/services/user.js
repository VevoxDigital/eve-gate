'use strict';

/**
 * @ngdoc service
 * @name eveGateApp.user
 * @description
 * # user
 * Service in the eveGateApp.
 */
angular.module('eveGateApp')
  .service('$user', function () {
    var user = {};

    this.isLogged = function () {
      return !!user.id;
    };

    return this;
  });
