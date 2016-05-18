'use strict';

describe('Service: $user', function () {

  // load the service's module
  beforeEach(module('eveGateApp'));

  // instantiate service
  var user;
  beforeEach(inject(function (_$user_) {
    user = _$user_;
  }));

  it('should do something', function () {
    expect(!!user).toBe(true);
  });

});
