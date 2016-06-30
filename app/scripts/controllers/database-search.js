'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:DatabaseSearchCtrl
 * @description
 * # DatabaseSearchCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('DatabaseSearchCtrl', function ($scope, backendService) {
    $scope.searchOptions = [
      ['Items', 'type', '/type'],
      ['Celestials', 'celestial', '/info/celestial'],
      ['Signatures', 'sig', '/info/sig'],
      ['Systems', 'system', '/logi/starmap']
    ];
    $scope.search = { opt: 0 };

    var searchOptsE = angular.element('#dbSearchOpts');
    var searchOptsButtonE = searchOptsE.children('button'),
        searchOptsDDOpt = searchOptsE.children('.form-dropdown-content');
    searchOptsButtonE.click(function () { searchOptsE.toggleClass('shown'); });
    searchOptsDDOpt.click(function (event) {
      searchOptsE.removeClass('shown');
      $scope.search.opt = parseInt(angular.element(event.target).attr('vx-search-opt'));
      $scope.$apply();
    });

    // Search functionals.
    var MIN_CHARS = 4, results, lastOpt = $scope.search.opt;
    $scope.showResults = function () { return typeof $scope.searchData === typeof { } };

    var searchDataUpdate = function (query) {
      if (query && query.length >= 4) {
        if (results && lastOpt == $scope.search.opt) {
          if (typeof results === typeof []) {
            $scope.searchData = [];
            results.forEach(function (res) {
              if (res.name.toLowerCase().includes(query.toLowerCase())) {
                $scope.searchData.push(res);
              }
            });
          } else {
            $scope.searchData = results;
          }
        } else {
          $scope.searchData = '<i class="fa fa-circle-o-notch fa-spin"></i>';
          backendService.get($scope.searchOptions[$scope.search.opt][1] + '/' + query + '/', {  }, function (res) {
            switch (res.status) {
              case 200:
                results = res.data;
                break;
              case -1:
                results = 'An unknown error has occurred.<br>See your browser\'s console for additional information.';
                break;
              default:
                results = 'Error ' + res.status + ' during search: ' + res.data.message;
                break;
            }
            $scope.searchData = results;
          });
        }
      } else {
        $scope.searchData = 'Enter at least ' + MIN_CHARS + ' to begin searching.';
        results = null;
      }
    };
    $scope.$watch('search.name', searchDataUpdate);
    $scope.$watch('search.opt', function () { results = null; searchDataUpdate($scope.search.name); });
    searchDataUpdate();
  });
