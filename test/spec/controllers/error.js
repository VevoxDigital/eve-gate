'use strict';

describe('Controller: ErrorCtrl', function () {

  // load the controller's module
  beforeEach(module('tech3App'));

  var ErrorCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ErrorCtrl = $controller('ErrorCtrl', {
      $scope: scope,
      $routeParams: { code: 0 }
      // place here mocked dependencies
    });
  }));

  it('should add errors to scope', function () {
    expect(typeof scope.errM).toBe('string');
    expect(typeof scope.errD).toBe('string');
  });
});
