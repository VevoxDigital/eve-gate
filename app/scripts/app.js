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
      .when('/item/:item?', {
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
              { text: 'Extended Trial', href: '@eveonline.com' },
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

  });
