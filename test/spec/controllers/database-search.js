'use strict';

describe('Controller: DatabaseSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('tech3App'));

  var DatabaseSearchCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    DatabaseSearchCtrl = $controller('DatabaseSearchCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(DatabaseSearchCtrl.awesomeThings.length).toBe(3);
  });
});
