'use strict';

describe('Service: GFareMap', function () {

  // load the service's module
  beforeEach(module('triphopApp'));

  // instantiate service
  var GFareMap;
  beforeEach(inject(function (_GFareMap_) {
    GFareMap = _GFareMap_;
  }));

  it('should do something', function () {
    expect(!!GFareMap).toBe(true);
  });

});
