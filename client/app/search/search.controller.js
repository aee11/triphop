'use strict';
var scope;
angular.module('triphopApp')
  .controller('SearchCtrl', function ($scope) {
		scope = $scope
    $scope.query = {
      start: "", 
      stops: [""]
    };

    $scope.search = function() {
				
    };

    $scope.addStop = function() {
      $scope.query.stops.push("");
    }
		
		$scope.removeStop = function(index){
			 if(index == 0){
				 return
			 }else{
			    $scope.query.stops.splice(index, 1);	 
					console.log("remove element: " + index);
			 }
		}
		
		$scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    $scope.clear = function () {
      $scope.dt = null;
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
		
    $scope.toggleMin();

    $scope.open = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
  });