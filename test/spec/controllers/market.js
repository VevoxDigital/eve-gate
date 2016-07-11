'use strict';

describe('Controller: MarketCtrl', function () {

  // load the controller's module
  beforeEach(module('tech3App'));

  var MarketCtrl,
    $scope;

  // Initialize the controller and a mock scope
  // Why are we running our unit tests using Exotic Dancers, again?
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    MarketCtrl = $controller('MarketCtrl', {
      $scope: $scope,
      backendService: { request: function (opts, cb) {
        // Mocked appraisal creation.
        if (opts.url === 'market/appraisal/') { return cb({
          status: 200,
          data: [{
            name: 'Exotic Dancers, Female',
            volume: 1,
            quantity: 10,
            price: { averagePrice: 90000 }
          }, {
            name: 'Exotic Dancers, Male',
            volume: 1,
            quantity: 10,
            price: { averagePrice: 60000 } // Somehow I'm not surprised these are actually cheaper.
          }, {
            name: 'Invalid Type',
            err: 'error'
          }]
        }); }
        // Mocked permalink creation.
        if (opts.url === 'market/permalink/') { return cb({
          status: 200,
          data: 'abcd123'
        }); }

      }, get: function (url, opts, cb) {
        // Mocked permalink fetching (with mock permalink)
        if (url === 'market/permalink/321dcba/') { return cb({
          status: 200,
          data: { items: [
            { name: 'Exotic Dancers, Female', quantity: 10 },
            { name: 'Exotic Dancers, Male', quantity: 10 }
          ] }
        }); }
      } }
    });
  }));

  describe('addQuery function', function () {
    it('should be exposed in scope', function () {
      expect(!!$scope.addQuery).toBe(true);
    });

    it('should add query to searchQuery', function () {
      // Add a query of 10 female exotic dancers
      $scope.query = { name: 'Exotic Dancers, Female', quantity: 10 };
      $scope.addQuery();

      // Veify search has one item of 10 exotic dancers.
      expect($scope.searchQuery.length).toBe(1);
      expect($scope.searchQuery[0].name).toBe('Exotic Dancers, Female');
      expect($scope.searchQuery[0].num).toBe(10);
    });

    it('should do nothing if query name is missing', function () {
      $scope.query = { };
      $scope.addQuery();

      expect($scope.searchQuery.length).toBe(0);
    });

    it('should set quantity to one if zero or missing', function () {
      $scope.query = { name: 'Exotic Dancers, Female' };
      $scope.addQuery();

      expect($scope.searchQuery.length).toBe(1);
      expect($scope.searchQuery[0].num).toBe(1);
    });
  });

  describe('delQuery function', function () {
    it('should be exposed in scope', function () {
      expect(!!$scope.delQuery).toBe(true);
    });

    it('should delete an entry by index', function () {
      // Populate the query with some data (should have past from previous `it` block) and verify it.
      $scope.query = { name: 'Exotic Dancers, Female', quantity: 10 };
      $scope.addQuery();
      expect($scope.searchQuery.length).toBe(1);

      // Delete the search query and verify.
      $scope.delQuery(0);
      expect($scope.searchQuery.length).toBe(0);
    });
  });

  describe('permalinkUpdate function', function () {
    it('should be exposed in scope', function () {
      expect(!!$scope.permalinkUpdate).toBe(true);
    });

    it('should do nothing if an active request is outgoing', function () {
      $scope.permalink = 1;
      $scope.requestPending = true;

      $scope.permalinkUpdate(2);
      expect($scope.permalink).toBe(1);
    });

    it('should add searchQuery and appraisal entries from permalink', function () {
      $scope.permalinkUpdate('321dcba');

      // Verify permalink is inserted into scope.
      expect($scope.permalink).toBe('321dcba');

      setTimeout(function () {
        // Verify permalink data was pushed to searchQuery and an appraisal was created.
        expect($scope.searchQuery.length).toBe(2);
        expect($scope.appraisal.length).toBe(2);
      });
    });
  });

  describe('createPermalink function', function () {
    it('should be exposed in scope', function () {
      expect(!!$scope.createPermalink).toBe(true);
    });

    it('should do nothing if a request is pending', function (done) {
      $scope.requestPending = true;
      $scope.createPermalink();
      setTimeout(function () { expect($scope.permalink).toBeFalsy(); done(); });
    });

    it('should do nothing if there is no appraisal', function (done) {
      // Default to no appraisal
      $scope.createPermalink();
      setTimeout(function () { expect($scope.permalink).toBeFalsy(); done(); });
    });

    it('should do nothing if a permalink already exists', function (done) {
      $scope.appraisal = true; // Have to skip this condition in the if.
      $scope.permalink = true;
      $scope.createPermalink();
      setTimeout(function () { expect($scope.permalink).toBe(true); done(); });
    });

    it('should create a permalink if data is valid', function (done) {
      // Create a mock permalink and verify it created and is in scope.
      $scope.appraisal = [{ name: 'Exotic Dancers, Female', quantity: 1 }];
      $scope.createPermalink();
      setTimeout(function () { expect($scope.permalink).toBe('abcd123'); done(); });
    });
  });

  describe('parseItems function', function () {
    it('should be exposed in scope', function () {
      expect(!!$scope.parseItems).toBe(true);
    });

    it('should parse paste data into search queries, ingnoring invalid', function () {
      // Add mock paste data to query and parse it.
      $scope.query = { pasteParser: 'Exotic Dancers, Female\t10\nExotic Dancers, Male\t10\nQuafe' };
      $scope.parseItems();

      // Verify two search items were added.
      expect($scope.searchQuery.length).toBe(2); // Three entries, but one is invalid.
      expect($scope.searchQuery[0].name).toBe('Exotic Dancers, Female');
      expect($scope.searchQuery[1].num).toBe(10);
    });
  });

  describe('createAppraisal function', function () {
    it('should be exposed in scope', function () {
      expect(!!$scope.createAppraisal).toBe(true);
    });

    it('should do nothing if a request is active', function (done) {
      $scope.requestPending = true;
      $scope.createAppraisal();
      setTimeout(function () { expect($scope.appraisal.length).toBe(0); done(); });
    });

    it('should create an appraisal from the api', function (done) {
      // Attempt to create an appraisal from mocked api response.
      $scope.createAppraisal();

      setTimeout(function () {
        // Verify creation and prices match mocked prices and commas are added correctly.
        expect($scope.appraisal.length).toBe(3);
        expect($scope.appraisal[0].price.unit).toBe(90000);
        expect($scope.appraisal[1].price.unit).toBe(60000);
        expect($scope.appraisal[0].volume).toBe('1.00');
        expect($scope.appraisal[1].volume).toBe('1.00');
        expect($scope.appraisal[2].err).toBeTruthy();

        // Verify totals correctly add up and commas are added correctly.
        expect($scope.appraisalTotal.volume).toBe('20.00');
        expect($scope.appraisalTotal.price).toBe('1,500,000.00');

        done();
      });
    });
  });

});
