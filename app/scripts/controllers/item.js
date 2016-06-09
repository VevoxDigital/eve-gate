'use strict';

/**
 * @ngdoc function
 * @name tech3App.controller:ItemCtrl
 * @description
 * # ItemCtrl
 * Controller of the tech3App
 */
angular.module('tech3App')
  .controller('ItemCtrl', function ($routeParams) {
    this.itemID = $routeParams.item;
    this.itemSearch = {};
  });
