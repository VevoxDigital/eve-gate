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

    if ($routeParams.item && !Number.isNaN(parseInt($routeParams.item))) {
      $scope.itemData = { id: $routeParams.item };
      itemService.fetch($routeParams.item, function (res) {
        if (typeof res === 'string') {
          $scope.itemData.name = res;
        } else {
          $scope.itemData = res;

          var desc = res.description;

          while (desc.includes('\r\n')) { desc = desc.replace('\r\n', '<br>'); }
          desc = desc.replace(/<url\=showinfo:/ig, '<a href=/info/item/');
          desc = desc.replace(/<\/url>/ig, '</a>');

          $scope.itemData.desc = desc;

          $scope.itemData.attrs = [];
          var indexPos = 0;
          $scope.itemData.dogma.attributes.forEach(function (a) {
            var i = indexPos++;
            itemService.fetchAttr(a.attribute.id, function (attr) {
              attr.value = a.value;
              $scope.itemData.attrs[i] = attr;
            });
          });
        }
      });
    } else {
      $timeout(function () {
        angular.element('#itemSearch').focus();
      }, 250);
    }

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
  });
