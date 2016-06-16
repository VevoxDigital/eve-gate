'use strict';

/**
 * @ngdoc service
 * @name tech3App.itemService
 * @description
 * # itemService
 * Service in the tech3App.
 */
angular.module('tech3App')
  .service('itemService', function ($http, BACKEND) {
    this.search = function (search, cb) {
      $http({
        method: 'GET',
        url: BACKEND.url + 'type',
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
        url: BACKEND.url + 'type?id=' + item
      }).then(function (res) {
        cb(res.data);
      }, function (res) {
        cb(res.status + ': ' + res.data);
      });
    };
  });
