'use strict';

angular.module('triphopApp')
  .controller('SearchCtrl', function ($scope, FareRoute, $http) {
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
      fareQuery = FareRoute.queryBuilder($scope.query);
      console.log(fareQuery);
		  FareRoute.nnApi.getNNRoute(fareQuery, function (route) {
        $scope.route = route;
        $scope.updateMapPath();
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
			 } else {
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

    $scope.selected = undefined;

    $scope.getLocation = function(prefix) {
      return $http.get('http://api.dohop.com/api/v1/picker/en/' + prefix).then(function(response){
        console.log(response);
        return response.data.matches;
      });
    };

    // Updates the lines on the map
    $scope.updateMapPath = function(){
      var points = []
      for (var o in $scope.route.airportsOnRoute) {
        var obj = $scope.route.airportsOnRoute[o];
        if(obj.hasOwnProperty('lon')){
          var point = {
            latitude: obj['lat'],
            longitude: obj['lon']
          }
        }
      }
      
      var route = $scope.route.route;
      for(var i=0; i<route.length; i++){
        var name = route[i].a;
        var lat = $scope.route.airportsOnRoute[name].lat;
        var lon = $scope.route.airportsOnRoute[name].lon;
        var point = {
          latitude: $scope.route.airportsOnRoute[name].lat,
          longitude: $scope.route.airportsOnRoute[name].lon
        }
        points.push(point);
      }
      $scope.polylines.path = points;
      $scope.polylines.path.push(points[0]);
    };
    
    // Lines for map
    var lineSymbol = {
        path: 3,
        strokeColor: "#ff0000",
        strokeOpacity: 1
    };
    var arrow = {
        icon: lineSymbol,
        offset: '25px',
        repeat: '50px',
    };
    
    $scope.polylines =  {
      path: [],
      stroke: {
        color: '#ff0000',
        weight: 2
      },
      icons: [arrow]
    };
  });