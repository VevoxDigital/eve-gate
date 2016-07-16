'use strict';

/**
 * @ngdoc service
 * @name tech3App.backendService
 * @description
 * # Backend Service
 * Service designed for accessing the backend api of the app.
 */
angular.module('tech3App')
  .service('backendService', function (BACKEND, $http, $location) {
    /**
      * @name tech3App.backendService.url
      * @constant
      * @description
      * # Backend Service URL
      * Backend URL defined in the module.
      */
    this.url = $location.protocol() + '://' + $location.host() + '/api/';

    /**
      * @name tech3App.backendService.request()
      * @param options Options passed to $http.
      * @param cb      Callback on request completion.
      * @description
      * # Backend HTTP request
      * Performs a request to the backend with the given options.
      */
    this.request = function (options, cb) {
      options.url = this.url + options.url;
      options.timeout = 5000;
      $http(options).then(cb, cb);
    };

    /**
      * @name tech3App.backendService.get()
      * @param route  The route to GET.
      * @param params GET parameters in the URL.
      * @param cb     Callback on request completion.
      * @description
      * # Backend HTTP GET
      * Sends a GET request to the backend.
      */
    this.get = function (route, params, cb) {
      this.request({ url: route, params: params }, cb);
    };


    return this;
  });
