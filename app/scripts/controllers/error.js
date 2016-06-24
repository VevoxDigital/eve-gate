'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:ErrorCtrl
 * @description
 * # ErrorCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('ErrorCtrl', function ($scope, $routeParams) {
    var codes = {
      'E0': [ 'Unknown Error', 'We have no idea what went wrong.' ],
      'E500': [ 'Internal Server Error', 'Something bad happened on our end.' ],
      'E404': [ 'Page Not Found', 'We could not find what you are looking for.' ]
    };
    var err = !!$routeParams && !!$routeParams.code ? codes['E' + $routeParams.code] || codes.E0 : codes.E0;
    $scope.errM = err[0];
    $scope.errD = err[1];
  });
