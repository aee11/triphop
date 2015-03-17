'use strict';

describe('Service: GoogleMapsInitializer', function () {

  // load the service's module
  beforeEach(module('triphopApp'));

  // instantiate service
  var GoogleMapsInitializer;
  beforeEach(inject(function (_GoogleMapsInitializer_) {
    GoogleMapsInitializer = _GoogleMapsInitializer_;
  }));

  it('should do something', function () {
    expect(!!GoogleMapsInitializer).toBe(true);
  });

});
