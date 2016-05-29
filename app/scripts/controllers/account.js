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
        $timeout(function () {
          $scope.pushError(0, 'This id a debug error');
        });
      }, 1000);
    };
    $scope.pushError = function (eid, err) {
      if (!eid && eid !== 0) { delete $scope.loginError; return; }
      var e = angular.element('[vx-eid='+eid+']'), panel = angular.element('#loginPanel');
      if (e.length == 0) { e = angular.element('[vx-eid=4]'); }
      $scope.loginError = {
        top: e.offset().top,
        left: panel.offset().left + panel.outerWidth(),
        msg: err
      };
    };
    $scope.$on('checkNew', function() { $scope.pushError(); });
  });
