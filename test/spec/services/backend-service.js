'use strict';

describe('Service: backendService', function () {

  // load the service's module
  beforeEach(module('tech3App'));

  // instantiate service
  var backendService;
  beforeEach(inject(function (_backendService_) {
    backendService = _backendService_;
  }));

  it('should expose service url', function () {
    expect(!!backendService.url).toBe(true);
    expect(/^https?:\/\/.*$/i.test(backendService.url)).toBe(true);
  });

  it('should attach request functions to service', function () {
    expect(typeof backendService.request).toBe('function');
    expect(typeof backendService.get).toBe('function');
  });

});
