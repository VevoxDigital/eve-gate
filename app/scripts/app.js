'use strict';

/**
 * @ngdoc overview
 * @name eveGateApp
 * @description
 * # eveGateApp
 *
 * Main module for EVE Gate.
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
  .config(function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope) {
    $rootScope.$meta = {
      title: function (title) {

      },
      nav: [
        [
          {
            text: 'Database',
            href: 'database',
            items: [
              {
                text: 'Wormhole Classes',
                href: 'wormhole'
              },
              {
                text: 'Cosmic Signatures',
                href: 'sigs'
              },
              {},
              {
                text: 'Item Database',
                href: 'items'
              }
            ]
          },
          {
            text: 'Logistics',
            href: 'logi',
            items: [
              {
                text: 'Starmaps',
                href: 'maps'
              },
              {
                text: 'System Lookup',
                href: 'system'
              },
              {},
              {
                text: 'Ship/Citadel Fitting',
                href: 'ships'
              },
              {
                text: 'Starbase Fitting',
                href: 'pos'
              }
            ]
          },
          {
            text: 'Industry',
            href: 'industry',
            items: [
              {
                text: 'Market Lookup',
                href: 'market'
              },
              {
                text: 'Profit Calculator',
                href: 'profits'
              },
              {},
              {
                text: 'Mining Statistics',
                href: 'mining'
              },
              {
                text: 'Reactions Statistics',
                href: 'reactions'
              }
            ]
          },
          {
            text: 'The Gate',
            href: 'gate',
            items: [
              {
                text: 'Support Us',
                href: 'support'
              },
              {
                text: 'GitHub Page',
                href: '@https://github.com/VevoxDigital/eve-gate'
              },
              {},
              {
                text: 'The Team',
                href: 'team'
              }
            ]
          }
        ],
        [

        ]
      ]
    };

    $rootScope.toggleNavDD = function (e, data) {
      var dd = angular.element('#navDD'), link = angular.element(e.target);
      if (!data) {
        dd.hide();
      } else {
        if (!data.items) return;
        link.append(dd);
        dd.show();
        dd.empty();
        data.items.forEach(function (item) {
          if (item.text) {
            if (item.href.startsWith('@')) {
              dd.append('<a href="' + item.href.substring(1) + '" target="_blank">' + item.text + '</a>');
            } else {
              dd.append('<a href="/' + data.href + '/' + item.href + '">' + item.text + '</a>');
            }
          } else {
            dd.append('<hr>');
          }
        });
      }
    };

    $rootScope.randomBannerImage = function () {
      var imgs = [ 'astero', 'cyclone_pos', 'dst_silo', 'epithal_planet', 'procurer' ];
      var r = Math.floor(Math.random() * imgs.length);
      console.log(r);
      return '/images/' + imgs[r] + '.png';
    };

  });
