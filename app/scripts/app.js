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
    'ngStorage',
    'ngSanitize'
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
      .when('/info/signature/:sig?', { redirectTo: '/error/460' })
      .when('/info/celestial/:celestial?', { redirectTo: '/error/460' })
      .when('/info/npcs', { redirectTo: '/error/460' })
      .when('/info/damages', { redirectTo: '/error/460' })
      .when('/indy/appraisal/:app?', { redirectTo: '/error/460' })
      .when('/indy/blueprints/:bp?', { redirectTo: '/error/460' })
      .when('/indy/reactions', { redirectTo: '/error/460' })
      .when('/indy/mining', { redirectTo: '/error/460' })
      .when('/logi/fits/:fit?', { redirectTo: '/error/460' })
      .when('/logi/fleets/:fleet?', { redirectTo: '/error/460' })
      .when('/logi/starmap/:system?', { redirectTo: '/error/460' })
      .when('/logi/wormholes', { redirectTo: '/error/460' })
      .when('/about/support', { redirectTo: '/error/460' })
      .when('/about/api', { redirectTo: '/error/460' })
      .when('/about/contact', { redirectTo: '/error/460' })
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
      id: function (val, is) {
        return typeof val === is;
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
              { text: 'Blueprint Buddy', href: 'blueprints' },
              { },
              { text: 'Reactions', href: 'reactions' },
              { text: 'Mining Profits', href: 'mining' }
            ]
          },
          {
            text: 'Logistics',
            href: 'logi',
            items: [
              { text: 'Ship Fitting', href: 'fits' },
              { text: 'Fleet Adverts', href: 'fleets' },
              { },
              { text: 'New Eden Starmap', href: 'starmap' },
              { text: 'Wormhole Mapping', href: 'wormholes' }
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
              { text: 'Contact Us', href: 'contact' }
            ]
          }
        ],
        [

        ]
      ]
    };
  });
