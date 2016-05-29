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
    $scope.login = {};
    $scope.$watch('login.email', function () { $scope.pushError(); });
    $scope.submitLogin = function () {
      $scope.pushError();
      var data = $scope.login;
      if (!data.email || !data.email.match(/^[^@]+@.+\..+$/)) { return $scope.pushError(0, 'That doesn\'t look quite right.'); }
      if (!data.pass) { return $scope.pushError(1, 'You\'ll need a password for this.'); }
      if (data.new) {
        if (data.pass !== data.pass2) { return $scope.pushError(2, 'These don\'t seem to match.'); }
        if (!data.tos) { return $scope.pushError(3, 'We\'ll need you to accept this.'); }
      }
      $user.logging = true;
      $timeout(function () {
        $user.logging = false;
        $timeout(function () {
          $scope.pushError(0, 'This is a debug error');
        });
      }, 1000);
    };
    $scope.pushError = function (eid, err) {
      var popup = angular.element('#errorPopup');
      if (!eid && eid !== 0) {
        popup.parents('form').find('.error').removeClass('error');
        delete $scope.loginError;
      } else {
        var e = angular.element('[vx-eid='+eid+']');
        if (e.length === 0) { e = angular.element('[vx-eid=4]'); }
        popup.detach().appendTo(e.addClass('error').parent());
        $scope.loginError = err;
      }
    };
  });
