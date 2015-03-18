'use strict';

describe('Service: FareQuery', function () {

  // load the service's module
  beforeEach(module('triphopApp'));

  // instantiate service
  var FareQuery;
  beforeEach(inject(function (_FareQuery_) {
    FareQuery = _FareQuery_;
  }));

  it('should do something', function () {
    expect(!!FareQuery).toBe(true);
  });

});
