'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('ItemCtrl', function ($scope, $routeParams, $timeout, backendService) {
    $scope.itemSearch = { showDust: false, showBP: false };

    $scope.itemTabIndex = 0;
    $scope.setTabIndex = function (i) { $scope.itemTabIndex = i; };
    $scope.isTabIndex = function (i) { return i === $scope.itemTabIndex; };
    $scope.itemTabs = ['Description', 'Attributes', 'Market Data'];

    if (!isNaN(Number($routeParams.item))) {
      $scope.itemData = { _id: $routeParams.item };
      backendService.get('type/' + $scope.itemData._id + '/', { }, function (res) {
        if (res.data.message) {
          // Is an error.
          $scope.itemData.err = res.status + ': ' + res.data.message;
        } else {
          // Update description.
          var desc = res.data.meta.description;
          while (desc.includes('\r\n')) { desc = desc.replace('\r\n', '<br>'); }
          res.data.meta.description = desc;

          // Update specialized attribute units.
          // TODO Quite a few units.
          res.data.meta.attributes.forEach(function (a) {
            var unit = a.attribute.meta.unit;
            a.value_str = unit ? a.value + ' ' + unit.displayName : a.value;
            if (unit) {
              if (unit.displayName === 'typeID')
                { a.value_str = '<a href="/info/item/' + a.value + '">typeref</a>'; } // TODO Type name?
              else if (unit.displayName === '1=small 2=medium 3=l')
                { a.value_str = a.value === 1 ? 'Small' : (a.value === 2 ? 'Medium' : 'Large'); }
              else if (unit.displayName === 'Level')
                { a.value_str = 'Level ' + a.value; }
            }
          });

          $scope.itemData = res.data;
        }
      });
    } else {
      console.log('TODO');
    }
  });
