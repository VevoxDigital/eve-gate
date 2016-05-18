'use strict';

describe('Controller: AccountCtrl', function () {

  // load the controller's module
  beforeEach(module('eveGateApp'));

  var AccountCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AccountCtrl = $controller('AccountCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should do something', function () {
    expect(!!AccountCtrl).toBe(true);
  });
});
