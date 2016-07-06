'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:MarketCtrl
 * @description
 * # MarketCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('MarketCtrl', function ($scope, backendService) {
    $scope.searchQuery = [];
    $scope.appraisal = []; $scope.appraisalError = null;
    $scope.query = { }; $scope.station = '';
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
    $scope.createAppraisal = function () {
      backendService.request({
        url: 'market/appraisal/',
        data: {
          station: $scope.station,
          query: $scope.searchQuery
        },
        method: 'POST'
      }, function (res) {
        if (res.status === 200) {
          function commas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
          $scope.appraisal = [];
          res.data.forEach((item) => {
            var price = item.price.buy ? {
              buy: Math.floor(item.price.buy * 100) / 100,
              sell: Math.floor(item.price.sell * 100) / 100
            } : Math.floor(item.price.averagePrice * 100) / 100;
            var ppv = item.price.buy ? {
              buy: Math.floor((price.buy/item.volume) * 100) / 100,
              sell: Math.floor((price.sell/item.volume) * 100) / 100
            } : Math.floor((price/item.volume) * 100) / 100;
            $scope.appraisal.push({
              name: item.name,
              volume: item.volume,
              quantity: item.quantity,
              price: item.price.buy ? {
                buy: {
                  unit: price.buy,
                  unit_str: commas(price.buy),
                  m3: ppv.buy,
                  m3_str: commas(ppv.buy),
                  total: price.buy * item.quantity,
                  total_str: commans(price.buy * item.quantity)
                },
                sell: {
                  unit: price.sell,
                  unit_str: commas(price.sell),
                  m3: ppv.sell,
                  m3_str: commas(ppv.sell),
                  total: price.sell * item.quantity,
                  total_str: commas(price.sell * item.quantity)
                }
              } : {
                unit: price,
                unit_str: commas(price),
                m3: ppv,
                m3_str: commas(ppv),
                total: price * item.quantity,
                total_str: commas(price * item.quantity)
              }
            });
          });
        } else {
          $scope.appraisalError = res.data ? res.status + ' Unknown error' : res.data.message;
        }
      });
    };
  });
