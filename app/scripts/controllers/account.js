'use strict';

/**
 * @ngdoc function
 * @name eveGateApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the eveGateApp
 */
angular.module('eveGateApp')
  .controller('AccountCtrl', function ($scope, $user, $timeout) {
    $scope.submitLogin = function () {
      $user.logging = true;
      $timeout(function () {
        $user.logging = false;
      }, 1000);
    };
  });
