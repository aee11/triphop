'use strict';

angular.module('triphopApp')
  .factory('FareRoute', function ($resource) {
    var fareAPI = $resource('/api/search/nn/', null, {
      getNNRoute: {
        method: 'GET',
        isArray: true
      }
    });

    // Public API here
    return {
      fareAPI: fareAPI
    };
  });
