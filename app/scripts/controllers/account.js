'use strict';

/**
 * @ngdoc function
 * @name eveGateApp.controller:AccountCtrl
 * @description
 * # AccountCtrl
 * Controller of the eveGateApp
 */
angular.module('eveGateApp')
  .controller('AccountCtrl', function ($scope, $timeout) {
    $timeout(function () {
      $scope.pageHeight = function () {
        var html = angular.element('html'),
            nav = angular.element('nav'),
            banner = angular.element('h1.pagebanner');
        return { height: html.height() - (nav.outerHeight() + banner.outerHeight()) };
      }();
      $timeout(function () {
        $scope.panelTop = function () {
          var panel = angular.element('#loginPanel'), page = angular.element('#loginPage');
          console.log((page.outerHeight()/2) - (panel.outerHeight()/2));
          return { top: (page.outerHeight()/2) - (panel.outerHeight()/2) };
        }();
      });
    });
  });
