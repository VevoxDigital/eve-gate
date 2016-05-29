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
    $scope.loginBox = {};
    $scope.submitLogin = function () {
      $user.logging = true;
      $scope.pushError();
      $timeout(function () {
        $user.logging = false;
        $timeout(function () {
          $scope.pushError(0, 'This is a debug error');
        });
      }, 1000);
    };
    $scope.pushError = function (eid, err) {
      var popup = angular.element('#errorPopup'), e = angular.element('[vx-eid='+eid+']');;
      if (!eid && eid !== 0) {
        e.removeClass('error');
        delete $scope.loginError;
      } else {
        if (e.length === 0) { e = angular.element('[vx-eid=4]'); }
        popup.detach().appendTo(e.addClass('error').parent());
        $scope.loginError = err;
      }
    };
    $scope.$watch('loginBox.checkNew', function() { $scope.pushError(); });
  });
