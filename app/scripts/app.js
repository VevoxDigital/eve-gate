'use strict';

/**
 * @ngdoc overview
 * @name tech3App
 * @description
 * # tech3App
 *
 * Main module for EVE Gate.
 */
angular
  .module('tech3App', [
    'ngAnimate',
    'ngRoute',
    'ngStorage'
  ])
  .config(function ($routeProvider, $locationProvider, $localStorageProvider) {
    $locationProvider.html5Mode(true);
    $localStorageProvider.setKeyPrefix('T3');
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/account/:user?', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        controllerAs: 'account'
      })
      .when('/error/:code', {
        templateUrl: 'views/error.html',
        controller: 'ErrorCtrl',
        controllerAs: 'error'
      })
      .when('/info/item/:item?', {
        templateUrl: 'views/item.html',
        controller: 'ItemCtrl',
        controllerAs: 'item'
      })
      .otherwise({
        redirectTo: '/error/404'
      });
  })
  .run(function ($rootScope, $compile, $user, $location) {
    $rootScope.$user = $user;
    $rootScope.$meta = {
      path: function () {
        var path = $location.path();
        return path.indexOf('/', 1) > 0 ? path.substring(0, path.indexOf('/', 1)) : path;
      },
      pause: function (ms) {
        var until = new Date().getTime() + ms;
        while (new Date().getTime() < until) { /* no-op */ }
      },
      nav: [
        [
          {
            text: 'Information',
            href: 'info',
            items: [
              { text: 'Item Database', href: 'item' },
              { text: 'Signature Database', href: 'signature' },
              { text: 'Celestials', href: 'celestial' },
              { },
              { text: 'NPC Ships', href: 'npc' },
              { text: 'Damage Cheat-Sheet', href: 'damages' }
            ]
          },
          {
            text: 'Industry',
            href: 'indy',
            items: [
              { text: 'Market Appraisals', href: 'appraisal' },
              { },
              { text: 'Reactions', href: 'reactions' },
              { text: 'Mining Profits', href: 'mining' }
            ]
          },
          {
            text: 'About',
            href: 'about',
            items: [
              { text: 'Support Tech3', href: 'support' },
              { text: 'Contribute', href: '@https://github.com/VevoxDigital/tech-3' },
              { text: 'Extended Trial', href: '@http://eveonline.com' },
              { text: 'Tech 3 API', href: 'api' },
              { },
              { text: 'Meet the Team', href: 'team' },
              { text: 'Contact Us', href: 'contact' }
            ]
          }
        ],
        [

        ]
      ]
    };
  });
