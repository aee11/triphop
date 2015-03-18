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
  .controller('SearchCtrl', function ($scope, $compile, FareRoute, $http, $window, GoogleMapsInitializer, FareQuery) {
		
		//plz remove
		scope = $scope;
		$scope.stops = {
			stops: []
		};
		
    var startLocation = FareQuery.getStartLocation();
    
    var check = function() {
        if (_.isObject(startLocation)) {
				$scope.startLocation = startLocation;
        // $scope.stops = FareQuery.getQuery();
        // console.log($scope.stops);
      } else {
        // console.log('redirecting to landing page');
        FareQuery.setStartLocation(null);
        $window.location.href = '/';
        return;
      }
    }
		check();
		
		// $scope.stops.markers = [];
		$scope.markers = [];
    var infoWindows = [];
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
      console.log(startLocation);
			var startAirport = startLocation.airports[0];
			var startCoordinates = $scope.getAirportLocation(startAirport);
			console.log(startCoordinates);
			var lat = startCoordinates.latitude;
			var lon = startCoordinates.longitude;
			$scope.stops.lat = lat;
			$scope.stops.lon = lon;
			$scope.stops.loc = $scope.startLocation;
			$scope.map.setCenter(new google.maps.LatLng(lat, lon));
			// $scope.addStop();
			$scope.addMarker(new google.maps.LatLng(lat, lon), startAirport);
		}
		
		$scope.flightPath = null;
		var drawPolyLines = function(locations) {
			// var flightPlanCoordinates = [];
			// for(var i=0; i<$scope.stops.stops.length; i++){
			// 	var lat = $scope.stops.stops[i].lat;
			// 	var lon = $scope.stops.stops[i].lon;
			// 	flightPlanCoordinates.push(
			// 		new $scope.google.maps.LatLng(lat, lon));
			// }
   //    _.forEach(locations, function(location) {
   //      var lat = lo
   //    });
      var arrowSymbol = {
        path: $scope.google.maps.SymbolPath.FORWARD_CLOSED_ARROW
      };
			$scope.flightPath = new google.maps.Polyline({
				path: locations,
				geodesic: true,
				strokeColor: '#FF0000',
				strokeOpacity: 0.4,
				strokeWeight: 1,
        icons: [{
          icon: arrowSymbol,
          offset: '50px',
          repeat: '50px'
        }]
			});
			$scope.flightPath.setMap($scope.map);
		}

    var drawRoute = function(route) {
      // Remove old route
      if ($scope.flightPath) {
        $scope.flightPath.setMap(null);
      }
      var locations = [];
      _.forEach(route, function (fare) {
        var airportLocation = $scope.getAirportLocation(fare.a);
        var globeLocation = new $scope.google.maps.LatLng(airportLocation.latitude, airportLocation.longitude);
        locations.push(globeLocation);
      });
      // Adding last leg home:
      locations.push(locations[0]);
      drawPolyLines(locations);
    };
		
		
		// marker functions
		// $scope.addMarkerLL = function(lat, lon){
			// $scope.addMarker(new google.maps.LatLng(lat, lon))
		// }
    var createContentString = function(info) {
      var contentString = '<div>' +
      '<h4>' +
      info.name +', ' + info.country +
      ' <span class="label label-info">' +
      info.airports[0] +
      '</span>' +
      '</h4>' +
      '<p>' + info.durationOfStay + ' days ' +
      '<span class="remove-marker-button"><button id="' + info.airports[0] + '" type="button" class="btn btn-danger btn-xs" ng-click="removeDestination($event)">' +
      'Remove' +
      '</button></span></p>' +
      '</div>';
      return contentString;
    };
		

		$scope.addMarker = function(location, airport, info) {
			var marker = new google.maps.Marker({
        title: airport,
				position: location,
				map: $scope.map,
				animation: google.maps.Animation.DROP
			});
			marker.airport = airport;
			$scope.markers.push(marker);
      if (info) { // then add InfoWindow
        var contentString = createContentString(info);
        var compiledContent = $compile(contentString)($scope);
        var infoWindow = new google.maps.InfoWindow({
          content: compiledContent[0]
        });
        infoWindows.push(infoWindow);
        $scope.google.maps.event.addListener(marker, 'click', function() {
          infoWindow.open($scope.map, marker);
        });
      }

		}
		

		$scope.removeStop = function(location){
			// for(var i=0; i<$scope.stops.stops.length; i++){
			// 	if($scope.stops.stops[i].airport == location){
			// 		console.log(location + ' stop removed');
			// 		$scope.stops.stops.splice(i, 1);
   //        FareQuery.removeLeg(location);
			// 		console.log($scope.stops.stops);
			// 	}
			// }
      FareQuery.removeLeg(location);
      if ($scope.flightPath) {
        $scope.flightPath.setOptions({ strokeColor: '#7e7e7e' });
      }
			for(var i=0; i<$scope.markers.length; i++){
				if($scope.markers[i].airport == location){
					console.log(location + ' marker removed');
					$scope.markers[i].setMap(null);
					$scope.markers.splice(i,1);
          infoWindows.splice(i,1);
					console.log($scope.markers);
				}
			}
		}
		
    $scope.route = {};
    $scope.search = function() {
      var query = FareQuery.getQuery();
      console.log(query);
      var fareQuery = FareRoute.queryBuilder(query);
      console.log(fareQuery);
		  FareRoute.routeApi.getTSPRoute(fareQuery, function (route) {
        $scope.route = route;
        drawRoute(route.routeFares);

        console.log($scope.route);
      }, function (err) {
        console.error(err);
      });
    };
		
    $scope.addStop = function() {
			var chosenAirport = $scope.stops.loc.airports[0];
			console.log("Chosen airport: " + chosenAirport);
			var duration = $scope.stops.dur;
			var location = $scope.getAirportLocation(chosenAirport);
			console.log('chosenAirport');
			console.log(chosenAirport);
			console.log('duration');
			console.log(duration);
			FareQuery.addLeg(chosenAirport, duration);
      var lat = location.latitude;
			var lon = location.longitude;
			// console.log(chosenAirport);
			// console.log(location);
			// console.log('adding marker at ' + lat + ', ' + lon);
			// console.log(lat);
			// console.log(lon);
			// $scope.stops.durs.push(duration);
      $scope.stops.stops.push({
				lat: lat,
				lon: lon,
				airport: chosenAirport,
				duration: duration
			});
      var info = $scope.stops.loc;
      info.durationOfStay = duration;
			$scope.addMarker(new $scope.google.maps.LatLng(lat, lon), chosenAirport, info);
    }
		
		$scope.today = function() {
      $scope.stops.startDate = new Date();
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
		
    $scope.makevalid = function(item,model,label){
      console.log($scope.newStop.loc.$valid);
      $scope.newStop.loc.$valid = false;

    }

    $scope.removeDestination = function (event) {
      var airportToRemove = event.target.id;
      $scope.removeStop(airportToRemove);
    }

});