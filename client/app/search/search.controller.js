'use strict';

angular.module('triphopApp')
  .controller('SearchCtrl', function ($scope, FareRoute) {
    $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
    $scope.query = {
      startLoc: "",
      stops: [""],
      durs: [""]
    };
    $scope.route = {};
    $scope.search = function() {
      var fareQuery = {
        startLoc: $scope.query.startLoc,
        startDate: moment($scope.query.startDate).format('YYYY-MM-DD'),
        legs: $scope.query.stops,
        durs: $scope.query.durs,
        userCountry: 'IS',
        currency: 'ISK'
      };
      console.log(fareQuery);
		  FareRoute.nnApi.getNNRoute(fareQuery, function (route) {
        $scope.route = route;
      }, function (err) {
        console.err(err);
      });
    };

    $scope.addStop = function() {
      $scope.query.stops.push("");
      $scope.query.durs.push("");
    }
		
		$scope.removeStop = function(index){
			 if(index == 0){
				 return
			 }else{
			    $scope.query.stops.splice(index, 1);
          $scope.query.durs.splice(index, 1);
					console.log("remove element: " + index);
			 }
		}
		
		$scope.today = function() {
      $scope.query.startDate = new Date();
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