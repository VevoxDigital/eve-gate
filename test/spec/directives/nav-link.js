'use strict';

describe('Directive: navLink', function () {

  // load the directive's module
  beforeEach(module('tech3App'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<nav-link></nav-link>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the navLink directive');
  }));
});
