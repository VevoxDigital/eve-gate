'use strict';

describe('Controller: ItemCtrl', function () {

  // load the controller's module
  beforeEach(module('tech3App'));

  var ItemCtrl,
    $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    ItemCtrl = $controller('ItemCtrl', {
      $scope: $scope,
      $routeParams: { item: '17765' },
      backendService: { get: function (url, opts, cb) {
        return cb({ data: { meta: { description: 'nondescript\r\n', attributes: [] } } });
      }}
    });
  }));

  describe('tab index functions', function () {
    it('should both be exposed to scope', function () {
      expect(!!$scope.setTabIndex).toBe(true);
      expect(!!$scope.isTabIndex).toBe(true);
    });

    it('should change the tab index', function () {
      expect($scope.itemTabIndex).toBe(0);
      $scope.setTabIndex(1);
      expect($scope.itemTabIndex).toBe(1);
    });

    it('should check current index', function () {
      expect($scope.isTabIndex(0)).toBe(true);
      expect($scope.isTabIndex(1)).toBe(false);
    });
  });

  it('should attack itemData to scope', function (done) {
    setTimeout(function () {
      expect($scope.itemData).toBeTruthy();
      done();
    });
  });

});
