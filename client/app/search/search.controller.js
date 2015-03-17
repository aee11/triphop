'use strict';
var scope;

function initialize() {
	var contentString = '<div id="content">'+
      '<div id="siteNotice">'+
      '</div>'+
      '<h2 id="firstHeading" class="firstHeading">Location</h2>'+
      '<div id="bodyContent">'+
			'<button onClick="console.log(' + "'hello'" + ')" >Click me!</button>'+
      '</div>'+
      '</div>';

	infowindow = new google.maps.InfoWindow({
			content: contentString
	});

  //infowindow.open(map,markers[0]);
}



angular.module('triphopApp')
  .controller('SearchCtrl', function ($scope, FareRoute, $http, $location, GoogleMapsInitializer) {

		// remove plz
		scope = $scope;
		
		$scope.markers = [];
		$scope.infowindow = undefined;
		
		//**** Get airport data json file
		$scope.airportData;
		// Simple GET request example :
		$http.get('/assets/airports_short.json').
			success(function(data, status, headers, config) {
				// this callback will be called asynchronously
				// when the response is available
				$scope.airportData = data;
			}).
			error(function(data, status, headers, config) {
				// called asynchronously if an error occurs
				// or server returns response with an error status.
				console.log('error')
			});
			
			
		$scope.getAirportLocation = function(airportCode){
			for(var i=0; i<$scope.airportData.length; i++){
				var result;
				if($scope.airportData[i].airportCode == airportCode){
					var lat = $scope.airportData[i].lat;
					var lon = $scope.airportData[i]['long'];
					
					result = {latitude: lat, longitude: lon}
					return result;
				}
			}
		}
		
		
		// * initialize map:
    GoogleMapsInitializer.mapsInitialized.then(function () {
      var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644),
        disableDefaultUI: true,
        minZoom: 1,
        maxZoom: 10
      };
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
			$scope.google = google;
			$scope.initGoogleMap();
    });
		
		$scope.initGoogleMap = function(){
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
			$scope.addMarker(new google.maps.LatLng(63.985, -22.605556));
		}
		
		// latitude: "63.985", longitude: "-22.605.556"
		

		
		
		
    if (angular.isObject(FareRoute.uiObject.query)) {
      console.log(FareRoute.uiObject.query);
      $scope.query = FareRoute.uiObject.query;
      // initialize(); // Smá ljótt
    } else {
      console.log('going to landing page');
      // $location.path('main');
      // return;
    }
		
    $scope.query = {
      startLoc: "",
      stops: [""],
      durs: [""],
			dur: "",
			loc: ""
    };
		
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
			console.log($scope.query.dur + " " + $scope.query.loc);
			$scope.addMarkerLL($scope.query.dur, $scope.query.loc);
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