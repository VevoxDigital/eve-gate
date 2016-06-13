'use strict';

/**
 * @ngdoc service
 * @name tech3App.itemService
 * @description
 * # itemService
 * Service in the tech3App.
 */
angular.module('tech3App')
  .service('itemService', function ($http) {
    this.search = function (search, cb) {
      $http({
        method: 'GET',
        //url: '/api/type',
        url: 'http://192.168.0.102:3000/api/type',
        params: { name: search }
      }).then(function (res) {
        cb(res.data);
      }, function (res) {
        cb(res.status + ': ' + res.data);
      });
    };
    this.fetch = function (item, cb) {
      $http({
        method: 'GET',
        url: 'https://crest-tq.eveonline.com/types/' + item + '/'
      }).then(function (res) {
        cb(res.data);
      }, function (res) {
        cb(res.status + ': ' + res.data);
      });
    };
  });
