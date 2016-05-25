'use strict';

/**
 * @ngdoc function
 * @name eveGateApp.controller:ErrorCtrl
 * @description
 * # ErrorCtrl
 * Controller of the eveGateApp
 */
angular.module('eveGateApp')
  .controller('ErrorCtrl', function ($scope, $routeParams) {
    var codes = {
      'E0': [ 'Unknown Error', 'We have no idea what went wrong.' ],
      'E500': [ 'Internal Server Error', 'Something bad happened on our end.' ],
      'E404': [ 'Page Not Found', 'We could not find what you are looking for.' ]
    };
    var err = codes['E' + $routeParams.code];
    $scope.errM = err[0];
    $scope.errD = err[1];
  });
