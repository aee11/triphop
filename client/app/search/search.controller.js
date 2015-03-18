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
        console.log($scope.query);
      } else {
        console.log('redirecting to landing page');
        FareQuery.setStartLocation(null);
        $window.location.href = '/';
        return;
      }
    }
		check();
		startLocation = undefined;
		
		$scope.markers = [];
		$scope.infowindow = undefined;
		$scope.currentBounds = undefined;
		
		//**** Get airport data json file
		// Simple GET request example :
		$http.get('/assets/airports_short.json').
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
				
		$scope.formatLatLon = undefined;
		$scope.getAirportLocation = function(airportCode){
			for(var i=0; i<$scope.airportData.length; i++){
				var result;
				if($scope.airportData[i].airportCode == airportCode){
					var lat = $scope.airportData[i].lat;
					var lon = $scope.airportData[i]['long'];
					
					// Cut off second '.' and everything beyond it
					var formatLatLon = function(ll){
						var dots = 0;
						for(var i=0; i<ll.length; i++){
							if(ll.substring(i,i+1) === '.'){
								dots++;
							}
							if(dots == 2){
								return ll.substring(0, i);
							}
						}
						return ll;
					}
					lat = formatLatLon(lat);
					lon = formatLatLon(lon);
					
					$scope.formatLatLon = formatLatLon;
					
					result = {latitude: lat, longitude: lon}
					return result;
				}
			}
		}
		
    GoogleMapsInitializer.mapsInitialized.then(function () {
      var mapOptions = {
        zoom: 5,
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
			$scope.initStartLocation();
		}
		
		$scope.initStartLocation = function(){
			var startAirport = $scope.startLocation.airports[0];
			var startCoordinates = $scope.getAirportLocation(startAirport);
			var lat = startCoordinates.latitude;
			var lon = startCoordinates.longitude;
			$scope.addMarker(new google.maps.LatLng(lat, lon));
			$scope.map.setCenter(new google.maps.LatLng(lat, lon));
		}
		
		
		// marker functions
		$scope.addMarkerLL = function(lat, lon){
			$scope.addMarker(new google.maps.LatLng(lat, lon))
		}
		
		$scope.addMarker = function(location, info) {
			var marker = new google.maps.Marker({
				position: location,
				map: $scope.map,
				animation: google.maps.Animation.DROP
			});
			$scope.markers.push(marker);
		}
		

		
    $scope.route = {};
    $scope.search = function() {
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
			var chosenAirport = $scope.query.loc.airports[0];
			var duration = $scope.query.dur;
			var location = $scope.getAirportLocation(chosenAirport);
			console.log(chosenAirport);
			console.log(location);
			var lat = location.latitude;
			var lon = location.longitude;
			console.log('adding marker at ' + lat + ', ' + lon);
			console.log(lat);
			console.log(lon);
			$scope.addMarker(new $scope.google.maps.LatLng(lat, lon));
			
      // $scope.query.stops.push("");
      // $scope.query.durs.push("");
			
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