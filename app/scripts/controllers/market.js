'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:MarketCtrl
 * @description
 * # MarketCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('MarketCtrl', function ($scope, $routeParams, $timeout, $location, regions, backendService) {
    $scope.$regions = regions;

    $scope.searchQuery = [];
    $scope.appraisal = []; $scope.appraisalError = null;
    $scope.appraisalTotal = { volume: 0, price: 0 };
    $scope.query = { };
    $scope.requestPending = false;
    $scope.addQuery = function () {
      if (!$scope.query.name) { return $scope.createAppraisal(); }
      if (!$scope.query.quantity) { $scope.query.quantity = 1; }
      $scope.searchQuery.push({ name: $scope.query.name, num: $scope.query.quantity });
      $scope.query = { };
      angular.element('.query-adder input[name=name]').focus();
    };
    $scope.delQuery = function (index) {
      $scope.searchQuery.splice(index, 1);
    };

    $scope.permalink = $routeParams.permalink;
    $scope.permalinkLink = undefined;
    if ($routeParams.permalink) {
      $scope.requestPending = true;
      backendService.get('market/permalink/' + $routeParams.permalink + '/', { }, function (res) {
        $scope.requestPending = false;
        if (res.status === 200) {
          res.data.items.forEach(function (item) { $scope.searchQuery.push({ name: item.name, num: item.quantity }); });
          $scope.createAppraisal();
        } else {
          $scope.appraisalError = res.data.message || JSON.stringify(res.data);
        }
      });
    }
    $scope.createPermalink = function () {
      if ($scope.requestPending || !$scope.appraisal.length || $scope.permalink) { return; }
      $scope.requestPending = true;
      var query = [];
      $scope.appraisal.forEach(function (item) {
        query.push({ name: item.name, quantity: item.quantity });
      });
      backendService.request({
        url: 'market/permalink/',
        data: { query: query },
        method: 'PUT'
      }, function (res) {
        $scope.requestPending = false;
        if (res.status === 200) {
          $location.path($location.path() + '/' + res.data);
          $scope.permalink = res.data;
        } else {
          $scope.appraisalError = res.data.message || JSON.stringify(res.data);
        }
      });
    };

    $scope.pasteParserShown = false;
    $scope.parseItems = function () {
      var items = { }, data = angular.element('#pasteParserContent').val();
      data = data.split('\n');
      data.forEach(function (line) {
        line = line.split('\t');
        line[1] = Number(line[1]);
        if (!line[1]) { return; }
        items[line[0]] = items[line[0]] || 0;
        items[line[0]] += line[1];
      });
      angular.forEach(items, function (num, name) {
        $scope.searchQuery.push({ name: name, num: num });
      });
      $scope.query.pasteParserShown = false;
    };

    $scope.createAppraisal = function () {
      if ($scope.requestPending) { return; }
      $scope.requestPending = true;
      backendService.request({
        url: 'market/appraisal/',
        data: {
          region: angular.element('#regionSelect').children('button').attr('vx-value'),
          query: $scope.searchQuery
        },
        method: 'POST'
      }, function (res) {
        $scope.requestPending = false;
        if (res.status === 200) {
          var commas = function (x) {
            x = x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            if (x.match(/^[0-9,]*$/)) { x = x + '.00'; }
            if (x.match(/^[0-9,]*\.[0-9]$/)) { x = x + '0'; }
            return x;
          };
          $scope.appraisal = [];
          $scope.appraisalTotal = { volume: 0 };
          res.data.forEach(function (item) {
            if (item.err || !item.volume) {
              $scope.appraisal.push({
                name: item.name,
                quantity: item.quantity,
                err: item.err || 'Invalid or unknown type name'
              });
            } else {
              if (!$scope.appraisalTotal.price) {
                $scope.appraisalTotal.price = item.price.buy ? { buy: 0, sell: 0 } : 0;
              }

              var price = item.price.buy ? {
                buy: Math.floor(item.price.buy * 100) / 100,
                sell: Math.floor(item.price.sell * 100) / 100
              } : Math.round(item.price.averagePrice * 100) / 100;
              var ppv = item.price.buy ? {
                buy: Math.floor((price.buy/item.volume) * 100) / 100,
                sell: Math.floor((price.sell/item.volume) * 100) / 100
              } : Math.round((price/item.volume) * 100) / 100;
              var total = item.price.buy ? {
                buy: Math.floor(price.buy * item.quantity * 100) / 100,
                sell: Math.floor(price.sell * item.quantity * 100) / 100
              } : Math.round(price * item.quantity * 100) / 100;

              $scope.appraisalTotal.volume += item.volume * item.quantity;
              $scope.appraisalTotal.price = item.price.buy ? {
                buy: $scope.appraisalTotal.price.buy + (total.buy),
                sell: $scope.appraisalTotal.price.sell + (total.sell)
              } : $scope.appraisalTotal.price + (total);

              $scope.appraisal.push({
                name: item.name,
                volume: commas(item.volume),
                quantity: item.quantity,
                price: item.price.buy ? {
                  buy: {
                    unit: price.buy,
                    unit_str: commas(price.buy),
                    m3: ppv.buy,
                    m3_str: commas(ppv.buy),
                    total: total.buy,
                    total_str: commas(total.buy)
                  },
                  sell: {
                    unit: price.sell,
                    unit_str: commas(price.sell),
                    m3: ppv.sell,
                    m3_str: commas(ppv.sell),
                    total: total.sell,
                    total_str: commas(total.sell)
                  }
                } : {
                  unit: price,
                  unit_str: commas(price),
                  m3: ppv,
                  m3_str: commas(ppv),
                  total: total,
                  total_str: commas(total)
                }
              });
            }
          });
          $scope.appraisalTotal.ppv = $scope.appraisalTotal.price.buy ? {
            buy: commas(Math.round($scope.appraisalTotal.price.buy / $scope.appraisalTotal.volume * 100) / 100),
            sell: commas(Math.round($scope.appraisalTotal.price.sell / $scope.appraisalTotal.volume * 100) / 100)
          } : commas(Math.round($scope.appraisalTotal.price / $scope.appraisalTotal.volume * 100) / 100);
          $scope.appraisalTotal.volume = commas($scope.appraisalTotal.volume);
          $scope.appraisalTotal.price = $scope.appraisalTotal.price.buy ? {
            buy: commas(Math.floor($scope.appraisalTotal.price.buy * 100) / 100),
            sell: commas(Math.floor($scope.appraisalTotal.price.sell * 100) / 100)
          } : commas(Math.round($scope.appraisalTotal.price * 100) / 100);
        } else {
          $scope.appraisalError = res.data ? res.status + ' Unknown error' : res.data.message;
        }
      });
    };
  });
