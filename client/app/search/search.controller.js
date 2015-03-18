'use strict';
var scope;


// function initialize() {
	// var contentString = '<div id="content">'+
      // '<div id="siteNotice">'+
      // '</div>'+
      // '<h2 id="firstHeading" class="firstHeading">Location</h2>'+
      // '<div id="bodyContent">'+
			// '<button onClick="console.log(' + "'hello'" + ')" >Click me!</button>'+
      // '</div>'+
      // '</div>';


	// infowindow = new google.maps.InfoWindow({
			// content: contentString
	// });


  // infowindow.open(map,markers[0]);
// }



angular.module('triphopApp')
  .controller('SearchCtrl', function ($scope, FareRoute, $http, $window, GoogleMapsInitializer, FareQuery) {
		
		//plz remove
		scope = $scope;
		
    var startLocation = FareQuery.getStartLocation();
    
    var check = function() {
        if (_.isObject(startLocation)) {
				$scope.startLocation = startLocation;
        $scope.query = FareQuery.getQuery();
        // console.log($scope.query);
      } else {
        // console.log('redirecting to landing page');
        FareQuery.setStartLocation(null);
        $window.location.href = '/';
        return;
      }
    }
		check();
		startLocation = undefined;
		
		// $scope.query.markers = [];
		$scope.markers = [];
		$scope.infowindow = undefined;
		$scope.currentBounds = undefined;
		$scope.formatLatLon = undefined;
		
		$scope.getAirportLocation = function(airportCode){
			for(var i=0; i<$scope.airportData.length; i++){
				var result;
				if($scope.airportData[i].id == airportCode){
          // latitudes in hours, minutes, seconds, direction
					var latH = $scope.airportData[i].latH;
          var latM = $scope.airportData[i].latM;
          var latS = $scope.airportData[i].latS;
          var latD = $scope.airportData[i].latD;
          // lon same as lat
					var lonH = $scope.airportData[i].lonH;
          var lonM = $scope.airportData[i].lonM;
          var lonS = $scope.airportData[i].lonS;
          var lonD = $scope.airportData[i].lonD;
					
					// convert to num
          var formatLatLon = function(latH, latM, latS, latD) {
            var minToNum = latM/60;
            var secToNum = latS/60/60;
            var totalLat = latH+minToNum+secToNum;
            if(latD == "S" || latD == "W"){
              return -totalLat;
            }
            return totalLat;
          }
					var lat = formatLatLon(latH, latM, latS, latD);
					var lon = formatLatLon(lonH, lonM, lonS, lonD);
					
					result = {latitude: lat, longitude: lon}
					return result;
				}
			}
		}
		
    GoogleMapsInitializer.mapsInitialized.then(function () {
      var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(63.985, -22.605),
        disableDefaultUI: true,
        minZoom: 1,
        maxZoom: 10
      };
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			$scope.google = google;
			$scope.initGoogleMap();
    });

		
		$scope.initGoogleMap = function(){
			$scope.google = google;
			
			//**** Get airport data json file
			// Simple GET request example :
			$http.get('/assets/airports_new.json').
				success(function(data, status, headers, config) {
					// this callback will be called asynchronously
					// when the response is available
					$scope.airportData = data;
					$scope.initStartLocation();
				}).
				error(function(data, status, headers, config) {
					// called asynchronously if an error occurs
					// or server returns response with an error status.
					console.log('error')
			});
		}
		
		$scope.initStartLocation = function(){
			var startAirport = $scope.startLocation.airports[0];
			var startCoordinates = $scope.getAirportLocation(startAirport);
			console.log(startCoordinates);
			var lat = startCoordinates.latitude;
			var lon = startCoordinates.longitude;
			$scope.query.lat = lat;
			$scope.query.lon = lon;
			$scope.query.loc = $scope.startLocation;
			$scope.map.setCenter(new google.maps.LatLng(lat, lon));
			// $scope.addStop();
			$scope.addMarker(new google.maps.LatLng(lat, lon));
		}
		
		
		// polylines
		$scope.drawPolyLines = function(){
			var flightPlanCoordinates = [
				// new $scope.google.maps.LatLng(37.772323, -122.214897),
				// new $scope.google.maps.LatLng(21.291982, -157.821856),
				// new $scope.google.maps.LatLng(-18.142599, 178.431),
				// new $scope.google.maps.LatLng(-27.46758, 153.027892)
			];
			for(var i=0; i<$scope.query.stops.length; i++){
				var lat = $scope.query.stops[i].lat;
				var lon = $scope.query.stops[i].lon;
				flightPlanCoordinates.push(
					new $scope.google.maps.LatLng(lat, lon));
			}
			var flightPath = new google.maps.Polyline({
				path: flightPlanCoordinates,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});
			flightPath.setMap($scope.map);
		}
		
		
		// marker functions
		// $scope.addMarkerLL = function(lat, lon){
			// $scope.addMarker(new google.maps.LatLng(lat, lon))
		// }
		
		$scope.addMarker = function(location, airport, info) {
			var marker = new google.maps.Marker({
				position: location,
				map: $scope.map,
				animation: google.maps.Animation.DROP
			});
			marker.airport = airport;
			$scope.markers.push(marker);
		}
		
		$scope.removeStop = function(location){
			for(var i=0; i<$scope.query.stops.length; i++){
				if($scope.query.stops[i].airport == location){
					console.log(location + ' stop removed');
					$scope.query.stops.splice(i, 1);
					console.log($scope.query.stops);
				}
			}
			for(var i=0; i<$scope.markers.length; i++){
				if($scope.markers[i].airport == location){
					console.log(location + ' marker removed');
					$scope.markers[i].setMap(null);
					$scope.markers.splice(i,1);
					console.log($scope.markers);
				}
			}
		}
		
    $scope.route = {};
    $scope.search = function() {
      var query = FareQuery.getQuery();
      console.log("query:");
      console.log(query);
      var fareQuery = FareRoute.queryBuilder(query);
      console.log(fareQuery);
		  FareRoute.routeApi.getTSPRoute(fareQuery, function (route) {
        $scope.route = route;
        //$scope.updateMapPath();
        console.log($scope.route);
      }, function (err) {
        console.err(err);
      });
    };
		
    $scope.addStop = function() {
			var chosenAirport = $scope.query.loc.airports[0];
			var duration = $scope.query.dur;
			var location = $scope.getAirportLocation(chosenAirport);
			var lat = location.latitude;
			var lon = location.longitude;
			// console.log(chosenAirport);
			// console.log(location);
			// console.log('adding marker at ' + lat + ', ' + lon);
			// console.log(lat);
			// console.log(lon);
			$scope.query.durs.push(duration);
      $scope.query.stops.push({
				lat: lat,
				lon: lon,
				airport: chosenAirport,
				duration: duration
			});
			$scope.addMarker(new $scope.google.maps.LatLng(lat, lon), chosenAirport);
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

    $scope.getLocation = FareRoute.getLocation;
		
});