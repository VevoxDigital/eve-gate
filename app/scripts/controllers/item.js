'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('ItemCtrl', function ($scope, $routeParams, $timeout, itemService) {
    $scope.itemSearch = { showDust: false, showBP: false };

    $scope.itemTabIndex = 0;
    $scope.setTabIndex = function(i) { $scope.itemTabIndex = i; }
    $scope.isTabIndex = function (i) { return i === $scope.itemTabIndex; };
    $scope.itemTabs = ['Description', 'Attributes', 'Market Data'];

    if ($routeParams.item && !Number.isNaN(parseInt($routeParams.item))) {
      $scope.itemData = { _id: $routeParams.item };
      itemService.fetch($scope.itemData._id, function (item) {
        if (typeof item === 'string') {
          // Is an error.
          $scope.itemData.err = item === '-1: null' ? 'Unknown error. See console.' : item;
        } else {
          $scope.itemData = item;
        }
      });
    } else {
      $timeout(function () {
        angular.element('#itemSearch').focus();
      }, 250);

      var results;
      $scope.data = 'Enter at least 4 characters to start searching.';

      $scope.dataDisplayable = function () {
        return typeof $scope.data === typeof [];
      };

      $scope.$watch('itemSearch.name', function (val) {
        if (val && val.length >= 4) {
          if (results) {
            if (typeof results === typeof []) {
              $scope.data = [];
              results.forEach(function (res) {
                if (res.name.toLowerCase().includes(val.toLowerCase())) {
                  $scope.data.push(res);
                }
              });
            } else {
              $scope.data = results;
            }
          } else {
            $scope.data = '<h2 class="fa fa-circle-notch fa-spin></h2>"';
            itemService.search(val, function (res) {
              res = res === '-1: null' ? 'Unknown Error when searching. See the Console.' : res;
              res = typeof res === 'string' ? 'Something went wrong!<br>' + res : res;
              results = res;
              $scope.data = results;
            });
          }
        } else {
          $scope.data = 'Enter at least 4 characters to start searching.';
          results = null;
        }
      });
    }
  });
