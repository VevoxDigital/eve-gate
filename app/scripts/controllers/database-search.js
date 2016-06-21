'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:DatabaseSearchCtrl
 * @description
 * # DatabaseSearchCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('DatabaseSearchCtrl', function ($scope) {
    $scope.searchOptions = [
      ['Items', 'type', '/info/type'],
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
  });
