'use strict';

describe('Service: backendService', function () {

  // load the service's module
  beforeEach(module('tech3App', function ($provide) {
    $provide.value('$http', function () {
      return { then: function (cb) {
        return cb('ok');
      } };
    });
  }));

  // instantiate service
  var backendService;
  beforeEach(inject(function (_backendService_) {
    backendService = _backendService_;
  }));

  it('should expose service url', function () {
    expect(!!backendService.url).toBe(true);
    expect(/^https?:\/\/.*$/i.test(backendService.url)).toBe(true);
  });

  describe('request function', function () {
    it('should be attached to service', function () {
      expect(!!backendService.request).toBe(true);
    });

    it('should call the http service', function (done) {
      backendService.request({ }, function (res) {
        expect(res).toBe('ok');
        done();
      });
    });
  });

  describe('get function', function () {
    it('should be attached to service', function () {
      expect(!!backendService.get).toBe(true);
    });

    it('should call the http service', function (done) {
      backendService.get('', { }, function (res) {
        expect(res).toBe('ok');
        done();
      });
    });
  });

});
