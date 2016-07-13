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
    $scope.$meta.title = 'Market Appraisals';
    $scope.$regions = regions;

    // Init scope vars
    $scope.searchQuery = [];
    $scope.appraisal = []; $scope.appraisalError = null;
    $scope.appraisalTotal = { volume: 0, price: 0 };
    $scope.query = { };
    $scope.requestPending = false;

    // Function to add search queries from the input boxes.
    $scope.addQuery = function () {
      if (!$scope.query.name) { return $scope.createAppraisal(); } // Do nothing if empty.
      if (!$scope.query.quantity) { $scope.query.quantity = 1; } // Default quantity to 1 if 0 or empty.
      $scope.searchQuery.push({ name: $scope.query.name, num: $scope.query.quantity });
      $scope.query = { };
      angular.element('.query-adder input[name=name]').focus();
    };
    // Function to delete search queries by index.
    $scope.delQuery = function (index) {
      $scope.searchQuery.splice(index, 1);
    };

    // Update permalink function and one-time call if visited with permalink route param.
    /* istanbul ignore next */
    if ($routeParams.permalink) { $scope.permalinkUpdate($routeParams.permalink); }
    $scope.permalinkUpdate = function (p) {
      if ($scope.requestPending) { return; }
      $scope.requestPending = true;
      $scope.permalink = p;
      backendService.get('market/permalink/' + p + '/', { }, function (res) {
        $scope.requestPending = false;
        /* istanbul ignore else */
        if (res.status === 200) {
          res.data.items.forEach(function (item) { $scope.searchQuery.push({ name: item.name, num: item.quantity }); });
          $scope.createAppraisal();
        } else {
          $scope.appraisalError = res.data.message || JSON.stringify(res.data);
        }
      });
    };

    // Create a new permalink
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
        /* istanbul ignore else */
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
      var items = { }; var data = $scope.query.pasteParser;
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
      $scope.appraisalError = 'Just a moment...';
      backendService.request({
        url: 'market/appraisal/',
        data: {
          region: angular.element('#regionSelect').children('button').attr('vx-value'),
          query: $scope.searchQuery
        },
        method: 'POST'
      }, function (res) {
        $scope.requestPending = false;
        delete $scope.appraisalError;
        /* istanbul ignore else */
        if (res.status === 200) {
          $scope.appraisal = [];
          $scope.appraisalTotal = { volume: 0 };
          res.data.forEach(function (item) {
            if (item.err || !item.volume) {
              /* istanbul ignore next */
              $scope.appraisal.push({
                _id: item._id,
                name: item.name,
                quantity: item.quantity,
                err: item.err || 'Invalid or unknown type name'
              });
            } else {
              if (!$scope.appraisalTotal.price) {
                /* istanbul ignore next */
                $scope.appraisalTotal.price = item.price.buy ? { buy: 0, sell: 0 } : 0;
              }

              /* istanbul ignore next */
              var price = item.price.buy ? {
                buy: Math.floor(item.price.buy * 100) / 100,
                sell: Math.floor(item.price.sell * 100) / 100
              } : Math.round(item.price.averagePrice * 100) / 100;
              /* istanbul ignore next */
              var ppv = item.price.buy ? {
                buy: Math.floor((price.buy/item.volume) * 100) / 100,
                sell: Math.floor((price.sell/item.volume) * 100) / 100
              } : Math.round((price/item.volume) * 100) / 100;
              /* istanbul ignore next */
              var total = item.price.buy ? {
                buy: Math.floor(price.buy * item.quantity * 100) / 100,
                sell: Math.floor(price.sell * item.quantity * 100) / 100
              } : Math.round(price * item.quantity * 100) / 100;

              $scope.appraisalTotal.volume += item.volume * item.quantity;
              /* istanbul ignore next */
              $scope.appraisalTotal.price = item.price.buy ? {
                buy: $scope.appraisalTotal.price.buy + (total.buy),
                sell: $scope.appraisalTotal.price.sell + (total.sell)
              } : $scope.appraisalTotal.price + (total);

              /* istanbul ignore next */
              $scope.appraisal.push({
                _id: item._id,
                name: item.name,
                volume: $scope.$meta.commas(item.volume),
                quantity: item.quantity,
                price: item.price.buy ? {
                  buy: {
                    unit: price.buy,
                    unit_str: $scope.$meta.commas(price.buy),
                    m3: ppv.buy,
                    m3_str: $scope.$meta.commas(ppv.buy),
                    total: total.buy,
                    total_str: $scope.$meta.commas(total.buy)
                  },
                  sell: {
                    unit: price.sell,
                    unit_str: $scope.$meta.commas(price.sell),
                    m3: ppv.sell,
                    m3_str: $scope.$meta.commas(ppv.sell),
                    total: total.sell,
                    total_str: $scope.$meta.commas(total.sell)
                  }
                } : {
                  unit: price,
                  unit_str: $scope.$meta.commas(price),
                  m3: ppv,
                  m3_str: $scope.$meta.commas(ppv),
                  total: total,
                  total_str: $scope.$meta.commas(total)
                }
              });
            }
          });
          /* istanbul ignore next */
          $scope.appraisalTotal.ppv = $scope.appraisalTotal.price.buy ? {
            buy: $scope.$meta.commas(Math.round($scope.appraisalTotal.price.buy / $scope.appraisalTotal.volume * 100) / 100),
            sell: $scope.$meta.commas(Math.round($scope.appraisalTotal.price.sell / $scope.appraisalTotal.volume * 100) / 100)
          } : $scope.$meta.commas(Math.round($scope.appraisalTotal.price / $scope.appraisalTotal.volume * 100) / 100);
          $scope.appraisalTotal.volume = $scope.$meta.commas($scope.appraisalTotal.volume);
          /* istanbul ignore next */
          $scope.appraisalTotal.price = $scope.appraisalTotal.price.buy ? {
            buy: $scope.$meta.commas(Math.floor($scope.appraisalTotal.price.buy * 100) / 100),
            sell: $scope.$meta.commas(Math.floor($scope.appraisalTotal.price.sell * 100) / 100)
          } : $scope.$meta.commas(Math.round($scope.appraisalTotal.price * 100) / 100);
        } else {
          $scope.appraisalError = res.data ? res.data.message : res.status + ' Unknown error';
        }
      });
    };
  });
