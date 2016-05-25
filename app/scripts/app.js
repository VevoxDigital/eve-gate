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
      .when('/account', {
        templateUrl: 'views/account.html',
        controller: 'AccountCtrl',
        controllerAs: 'account'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .run(function ($rootScope, $compile, $user, $location, $timeout) {
    $rootScope.$user = $user;
    $rootScope.$meta = {
      route: $location.path(),
      pause: function (ms) {
        var until = new Date().getTime() + ms;
        while (new Date().getTime() < until) { /* no-op */ }
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
                text: 'Price Trends',
                href: 'trends'
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
                text: 'Contribute',
                href: '@https://github.com/VevoxDigital/eve-gate'
              },
              {},
              {
                text: 'The Team',
                href: 'team'
              },
              {
                text: 'Contact Us',
                href: 'contact'
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
        if (!data.items) { return; }
        link.append(dd);
        dd.css('left', link.offset().left).css('min-width', link.outerWidth());
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
        dd.show();
      }
    };

    $rootScope.toggleNavMobile = function () {
      var nav = angular.element('#navMobile');
      if (!nav.is(':visible')) {
        $rootScope.$meta.nav[0].forEach(function (link) {
          var a = $compile('<a href="/' + link.href + '">' + link.text + '</a>')($rootScope);
          if (link.items) {
            link.items.forEach(function (item) {
              if (item.href) {
                a.append(
                  item.href.startsWith('@') ?
                  '<a href="' + item.href.substring(1) + '" target="_blank">' + item.text + '</a>' :
                  '<a href="/' + link.href + '/' + item.href + '">' + item.text + '</a>'
                );
              }
            });
          }
          nav.append(a);
        });
        nav.css('left', -nav.outerWidth()).show();
      }
      nav.velocity({
        left: nav.offset().left === 0 ? -nav.outerWidth() : 0
      });
    };

    $rootScope.randomBannerImage = function () {
      var imgs = [ 'astero', 'cyclone_pos', 'dst_silo', 'epithal_planet', 'procurer' ];
      var r = Math.floor(Math.random() * imgs.length);
      return '/images/' + imgs[r] + '.png';
    };

    $rootScope.$on('$routeChangeSuccess', function (e, to) {
      /*$timeout(function () {
        angular.element('[ng-view]:not(.ng-enter)').attr('vx-route', $location.path());
      });*/
    });
    $rootScope.$on('$routeChangeStart', function (e, to) {
      $timeout(function () {
        angular.element('.ng-enter[ng-view]').attr('vx-route', $location.path());
      });
    });

  });
