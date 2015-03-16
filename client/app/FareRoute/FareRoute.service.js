'use strict';

angular.module('triphopApp')
  .factory('FareRoute', function ($resource) {
    var nnApi = $resource('/api/search/nn/', null, {
      getNNRoute: {
        method: 'GET'
      }
    });

    var queryBuilder = function(query) {
      var airportCodesPerLocation = _.map(query.stops, function (stop) {
        return stop.airports.join();
      });
      return {
        startLoc: query.startLoc.airports.join(),
        startDate: moment(query.startDate).format('YYYY-MM-DD'),
        legs: airportCodesPerLocation,
        durs: query.durs,
        userCountry: 'IS',
        currency: 'ISK'
      }
    };

    var tdtspSolver = function(fareData) {
      
    };
    // Public API here
    return {
      nnApi: nnApi,
      queryBuilder: queryBuilder
    };
  });
