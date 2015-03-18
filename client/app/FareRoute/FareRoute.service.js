'use strict';

angular.module('triphopApp')
  .factory('FareRoute', function ($resource, $http) {
    var routeApi = $resource('/api/search/:algorithm/', null, {
      getNNRoute: {
        method: 'GET',
        params: {
          algorithm: 'nn'
        }
      },
      getTSPRoute: {
        method: 'GET',
        params: {
          algorithm: 'tsp'
        }
      }
    });

    var queryBuilder = function(query) {
			// var airports = [];
			// for(var i=0; i<query.stops.length; i++){
				// airports.push(query.stops[i].airport);
			// }
      return {
        startLoc: query.startLoc.airports[0],
        startDate: moment(query.startDate).format('YYYY-MM-DD'),
        legs: query.stops,
        durs: query.durs,
        userCountry: 'IS',
        currency: 'ISK'
      }
    };

    var getLocation = function(prefix) {
      return $http.get('http://api.dohop.com/api/v1/picker/en/' + prefix).then(function(response){
        return response.data.matches;
      });
    };

    // Public API here
    return {
      routeApi: routeApi,
      queryBuilder: queryBuilder,
      getLocation: getLocation,
      uiObject: {query: null}
    };
  });
