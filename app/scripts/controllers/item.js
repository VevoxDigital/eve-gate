'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('ItemCtrl', function ($scope, $routeParams, $timeout, $location, backendService) {
    $scope.itemTabIndex = 0;
    $scope.setTabIndex = function (i) { $scope.itemTabIndex = i; };
    $scope.isTabIndex = function (i) { return i === $scope.itemTabIndex; };
    $scope.itemTabs = ['Description', 'Attributes', 'Market Data'];

    /* istanbul ignore else */
    if (!isNaN(Number($routeParams.item))) {
      $scope.itemData = { _id: $routeParams.item };
      backendService.get('type/' + $scope.itemData._id + '/', { }, function (res) {
        /* istanbul ignore if */
        if (res.data.message) {
          // Is an error.
          $scope.itemData.err = res.status + ': ' + res.data.message;
        } else {
          // Update description.
          var desc = res.data.meta.description || '';
          while (desc.indexOf('\r\n') >= 0) { desc = desc.replace('\r\n', '<br>'); }
          res.data.meta.description = desc;

          res.data.meta.volume_str = $scope.$meta.commas(res.data.meta.volume);
          res.data.market.est.averagePrice_str = $scope.$meta.commas(res.data.market.est.averagePrice);
          res.data.market.est.adjustedPrice_str = $scope.$meta.commas(res.data.market.est.adjustedPrice);

          // Update specialized attribute units.
          // TODO Quite a few units.
          /* istanbul ignore next */
          res.data.meta.attributes.forEach(function (a) {
            var unit = a.attribute.meta.unit;
            a.value_str = unit ? a.value + ' ' + unit.displayName : a.value;
            if (unit) {
              if (unit.displayName === 'typeID')
                { a.value_str = '<a href="/info/item/' + a.value + '">@typeref</a>'; } // TODO Type name?
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
      $location.path('/search');
    }
  });
