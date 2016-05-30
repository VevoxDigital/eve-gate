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
        if (!data.tos) { return $scope.pushError(3, 'We need you to accept this.'); }
      }
      $user.logging = true;
      if (data.new) {
        $user.create(data.email, data.pass, function (err, eid) {
          $user.logging = false;
          if (err) {
            // TODO Handle non-string errors.
            $timeout(function () {
              $scope.pushError(typeof eid === 'number' ? eid : 4, err.toString());
            }, 500);
          }
        });
      } else {
        $user.login(data.email, data.pass, function (err, eid) {
          $user.logging = false;
          if (err) {
            // TODO Handle non-string errors.
            $timeout(function () {
              $scope.pushError(typeof eid === 'number' ? eid : 4, err.toString());
            }, 500);
          }
        });
      }
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
