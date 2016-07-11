'use strict';

describe('App init run', function () {

  beforeEach(module('tech3App'));

  var $rootScope;
  beforeEach(inject(function (_$rootScope_) {
    $rootScope = _$rootScope_;
  }));

  describe('meta commas function', function () {
    it('should be exposed in rootScope meta', function () {
      expect(!!$rootScope.$meta.commas).toBe(true);
    });

    it('should add commas to a number', function () {
      expect($rootScope.$meta.commas(1000)).toBe('1,000.00');
    });

    it('should add necessary decimal places', function () {
      expect($rootScope.$meta.commas(10.2)).toBe('10.20');
    });
  });

});
