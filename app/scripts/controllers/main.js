'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller for the main landing page for EVE Gate.
 */
angular.module('tech3App')
  .controller('MainCtrl', function ($scope) {
    $scope.features = [
      { icon: 'github', title: 'Open Source Design', desc: 'Community driven and reinforced content.', href: 'https://github.com/VevoxDigital/tech-3' },
      { icon: 'line-chart', title: 'Real-time Marketing', desc: 'Lots of market data, readily available.', href: '/indy/market' },
      { icon: 'map-o', title: 'Advanced Mapping', desc: 'Keep your intel up to date, any time.', href: '/logi/starmap' },
      { icon: 'rocket', title: 'Colaborative Fitting', desc: 'Work together to make that awesome ship.', href: '/logi/fits' },
      { icon: 'users', title: 'Corporation Management', desc: 'Advanced features for corporation directors', href: '/account/corp' }
    ];
  });
