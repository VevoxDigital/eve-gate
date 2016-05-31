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
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('do something', function () {
    expect(!!ErrorCtrl).toBe(true);
  });
});
