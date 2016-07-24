'use strict';

describe('Controller: IndyReactionsCtrl', function () {

  // load the controller's module
  beforeEach(module('tech3App'));

  var IndyReactionsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IndyReactionsCtrl = $controller('IndyReactionsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(IndyReactionsCtrl.awesomeThings.length).toBe(3);
  });
});
