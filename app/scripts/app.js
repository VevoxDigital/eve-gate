'use strict';

/**
 * @ngdoc overview
 * @name eveGateApp
 * @description
 * # eveGateApp
 *
 * Main module of the application.
 */
angular
  .module('eveGateApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
