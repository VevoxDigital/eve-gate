'use strict';

/**
 * @ngdoc directive
 * @name tech3App.directive:navLink
 * @description
 * # navLink
 */
angular.module('tech3App')
  .directive('navLink', function () {
    return {
      templateUrl: '/views/directives/nav-link.html',
      restrict: 'A',
      scope: { navLinkScope: '&' },
      link: function (scope) {
        scope.$watch('navLinkScope', function () {
          scope.link = scope.navLinkScope();
        });
      }
    };
  });
