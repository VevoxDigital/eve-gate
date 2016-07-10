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
  .constant('BACKEND', {
    url: 'http://192.168.0.102:3000/api/',
    message: 'Tech 3 is still in active development and may change drastically during this time. Expect some bugs as we work through this.'
  })
  .constant('regions', [
    { id: 10000002, name: 'The Forge (Jita)' },
    { id: 10000043, name: 'Domain (Amarr)' },
    { id: 10000032, name: 'Sinq Laison (Dodixie)' },
    { id: 10000030, name: 'Heimatar (Rens)' },
    { id: 10000042, name: 'Metropolis (Hek)' },

    { id: 10000054, name: 'Aridia' },
    { id: 10000069, name: 'Black Rise' },
    { id: 10000038, name: 'The Bleak Lands' },
    { id: 10000055, name: 'Branch' },
    { id: 10000007, name: 'Cache' },
    { id: 10000014, name: 'Catch' },
    { id: 10000033, name: 'The Citadel' },
    { id: 10000051, name: 'Cloud Ring' },
    { id: 10000053, name: 'Cobalt Edge' },
    { id: 10000012, name: 'Curse' },
    { id: 10000035, name: 'Deklein' },
    { id: 10000060, name: 'Delve' },
    { id: 10000001, name: 'Derelik' },
    { id: 10000005, name: 'Detorid' },
    { id: 10000036, name: 'Devoid' },
    { id: 10000027, name: 'Etherium Reach' },
    { id: 10000039, name: 'Esoteria' },
    { id: 10000064, name: 'Essence' },
    { id: 10000037, name: 'Everyshore' },
    { id: 10000046, name: 'Fade' },
    { id: 10000056, name: 'Feythabolis' },
    { id: 10000058, name: 'Fountain' },
    { id: 10000029, name: 'Geminate' },
    { id: 10000067, name: 'Genesis' },
    { id: 10000011, name: 'Great Wildlands' },
    { id: 10000025, name: 'Immensea' },
    { id: 10000031, name: 'Impass' },
    { id: 10000009, name: 'Insmother' },
    { id: 10000052, name: 'Kador' },
    { id: 10000034, name: 'The Kalevala Expanse' },
    { id: 10000049, name: 'Khanid' },
    { id: 10000065, name: 'Kor-Azor' },
    { id: 10000016, name: 'Lonetrek' },
    { id: 10000013, name: 'Malpais' },
    { id: 10000028, name: 'Molden Heath' },
    { id: 10000040, name: 'Oasa' },
    { id: 10000062, name: 'Omist' },
    { id: 10000021, name: 'Outer Passage' },
    { id: 10000057, name: 'Outer Ring' },
    { id: 10000059, name: 'Paragon Soul' },
    { id: 10000063, name: 'Period Basis' },
    { id: 10000066, name: 'Perrigen Falls' },
    { id: 10000048, name: 'Placid' },
    { id: 10000047, name: 'Providence' },
    { id: 10000023, name: 'Pure Blind' },
    { id: 10000050, name: 'Querious' },
    { id: 10000008, name: 'Scalding Pass' },
    { id: 10000044, name: 'Solitude' },
    { id: 10000018, name: 'The Spire' },
    { id: 10000022, name: 'Stain' },
    { id: 10000041, name: 'Syndicate' },
    { id: 10000020, name: 'Tash-Murkon' },
    { id: 10000045, name: 'Tenal' },
    { id: 10000061, name: 'Tenerifis' },
    { id: 10000010, name: 'Tribute' },
    { id: 10000003, name: 'Vale of the Silent' },
    { id: 10000015, name: 'Venal' },
    { id: 10000068, name: 'Verge Vendor' },
    { id: 10000006, name: 'Wicked Creek' }

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
      .when('/search', {
        templateUrl: 'views/database-search.html',
        controller: 'DatabaseSearchCtrl',
        controllerAs: 'databaseSearch'
      })
      .when('/market/:permalink?', {
        templateUrl: 'views/market.html',
        controller: 'MarketCtrl',
        controllerAs: 'market'
      })
      .otherwise({
        redirectTo: '/error/404'
      });
  })
  .run(function ($rootScope, $compile, $user, $location, $timeout, BACKEND) {
    $rootScope.$user = $user;
    $rootScope.$meta = {
      backendMsg: BACKEND.message,
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
            fa: 'database',
            items: [
              { text: 'Database Search', href: 'search' },
            ]
          },
          {
            text: 'Industry',
            fa: 'cogs',
            items: [
              { text: 'Market Appraisals', href: 'market' },
              { },
              { text: 'Reaction Info', href: 'industry/reactions' },
              { text: 'Mining Profits', href: 'industry/mining' }
            ]
          },
          {
            text: 'Logistics',
            fa: 'map',
            items: [
              { text: 'New Eden Starmap', href: 'map' },
            ]
          },
          {
            text: 'About',
            fa: 'question-circle',
            items: [
              { text: 'Support Tech3', href: 'support' },
              { text: 'Contribute', href: '@https://github.com/VevoxDigital/tech-3' },
              { text: 'Tech 3 API', href: 'about/api' },
              { },
              { text: 'Contact Us', href: 'about' }
            ]
          }
        ],
        [

        ]
      ]
    };

    var updateDropdown = function (dd, index) {
      index = index || 0;
      var ddc = dd.children('.form-dropdown-content');
      dd.children('button').attr('vx-value', ddc.children('a:nth-child('+(index+1)+')').attr('vx-value'));
      dd.children('button').children('.text').html(ddc.children('a:nth-child('+(index+1)+')').html());
      dd.on('click', function (e) {
        var target = angular.element(e.target);
        if (target.is('a')) {
          dd.off('click');
          updateDropdown(dd, target.index())
        }
        dd.toggleClass('shown');
      });
    };
    $rootScope.$on('$routeChangeSuccess', function () {
      $timeout(function () {
        angular.element('.form-dropdown').each(function (index) {
          angular.element(this).off('click');
          updateDropdown(angular.element(this));
        });
      });
    });
  });
