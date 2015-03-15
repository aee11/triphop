'use strict';

angular.module('triphopApp')
  .factory('FareRoute', function ($resource) {
    var nnApi = $resource('/api/search/nn/', null, {
      getNNRoute: {
        method: 'GET'
      }
    });

    // Public API here
    return {
      nnApi: nnApi
    };
  });
