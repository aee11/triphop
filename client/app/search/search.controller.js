'use strict';

angular.module('triphopApp')
  .controller('SearchCtrl', function ($scope) {
    $scope.query = {
      start: "", 
      stops: [""]
    };

    $scope.search = function() {

    };

    $scope.addStop = function() {
      //$scope.query.stops.push("");
    }
  });
