'use strict';

describe('Controller: DatabaseSearchCtrl', function () {

  // load the controller's module
  beforeEach(module('tech3App'));

  var DatabaseSearchCtrl,
    $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    DatabaseSearchCtrl = $controller('DatabaseSearchCtrl', {
      $scope: $scope,
      backendService: { }
    });
  }));

  describe('showResults function', function () {
    it('should be exposed to scope', function () {
      expect(!!$scope.showResults).toBe(true);
    });

    it('should show results if data is an object', function () {
      expect($scope.showResults()).toBe(false);
      $scope.searchData = { };
      expect($scope.showResults()).toBe(true);
    });
  });

});
