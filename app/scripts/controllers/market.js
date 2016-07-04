'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:MarketCtrl
 * @description
 * # MarketCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('MarketCtrl', function ($scope) {
    $scope.searchQuery = [];
    $scope.query = { };
    $scope.addQuery = function () {
      if (!$scope.query.name) { return; }
      if (!$scope.query.quantity) { $scope.query.quantity = 1; }
      $scope.searchQuery.push({ name: $scope.query.name, num: $scope.query.quantity });
      $scope.query = { };
      angular.element('.query-adder input[name=name]').focus();
    };
    $scope.delQuery = function (index) {
      $scope.searchQuery.splice(index, 1);
    };
  });
