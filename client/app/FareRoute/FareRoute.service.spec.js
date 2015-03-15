'use strict';

describe('Service: FareRoute', function () {

  // load the service's module
  beforeEach(module('triphopApp'));

  // instantiate service
  var FareRoute;
  beforeEach(inject(function (_FareRoute_) {
    FareRoute = _FareRoute_;
  }));

  it('should do something', function () {
    expect(!!FareRoute).toBe(true);
  });

});
