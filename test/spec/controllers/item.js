'use strict';

describe('Controller: ItemCtrl', function () {

  // load the controller's module
  beforeEach(module('tech3App'));

  var ItemCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ItemCtrl = $controller('ItemCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should exist for now', function () {
    expect(!!ItemCtrl).toBe(true);
  });
});
