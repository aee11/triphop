'use strict';

angular.module('triphopApp')
  .controller('LandingCtrl', function ($scope) {
    $scope.message = 'Hello';
    $scope.showParam = true;

    $scope.searchFirst = function(){
      $scope.showParam = false;
      console.log($scope.showParam);
    }
  });
