'use strict';
var scope;
var map;
var markers = [];
var infowindow;
function initialize() {
	// var mapOptions = {
	// 	zoom: 8,
	// 	center: new google.maps.LatLng(-34.397, 150.644),
	// 	disableDefaultUI: true,
	// 	minZoom: 1,
	// 	maxZoom: 10
	// };
	// map = new google.maps.Map(document.getElementById('map-canvas'),
	// 		mapOptions);
			

	addMarker(new google.maps.LatLng(-34.397, 150.644));

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
	
	////////// 
	/*
	 var strictBounds = new google.maps.LatLngBounds(
	 new google.maps.LatLng(-150, -90),
	 new google.maps.LatLng(150, 90));

	 // Listen for the dragend event
	 google.maps.event.addListener(map, 'dragend', function () {
			 if (strictBounds.contains(map.getCenter())) return;

			 // We're out of bounds - Move the map back within the bounds

			 var c = map.getCenter(),
					 x = c.lng(),
					 y = c.lat(),
					 maxX = strictBounds.getNorthEast().lng(),
					 maxY = strictBounds.getNorthEast().lat(),
					 minX = strictBounds.getSouthWest().lng(),
					 minY = strictBounds.getSouthWest().lat();

			 if (x < minX) x = minX;
			 if (x > maxX) x = maxX;
			 if (y < minY) y = minY;
			 if (y > maxY) y = maxY;

			 map.setCenter(new google.maps.LatLng(y, x));
	 });


	*/ 
	/////// 
	
  // infowindow.open(map,markers[0]);
}
function addMarkerLL(lat, lon){
	addMarker(new google.maps.LatLng(lat, lon))
}

function addMarker(location, info) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		animation: google.maps.Animation.DROP
	});
	markers.push(marker);
}

// function loadScript() {
// 	var script = document.createElement('script');
// 	script.type = 'text/javascript';
// 	script.src = 'https://maps.googleapis.com/maps/api/js?v=3.exp' +
// 			'&signed_in=false&callback=initialize';
// 	document.body.appendChild(script);
// }
			


// window.onload = loadScript;

angular.module('triphopApp')
  .controller('SearchCtrl', function ($scope, FareRoute, $http, $window, GoogleMapsInitializer, FareQuery) {
    var startLocation = FareQuery.getStartLocation();
    if (_.isObject(startLocation)) {
      
    } else {
      console.log('redirecting to landing page');
      FareQuery.setStartLocation(null);
      $window.location.href = '/';
      return;
    }

    GoogleMapsInitializer.mapsInitialized.then(function () {
      var mapOptions = {
        zoom: 8,
        center: new google.maps.LatLng(-34.397, 150.644),
        disableDefaultUI: true,
        minZoom: 1,
        maxZoom: 10
      };
      map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    });
		scope = $scope;
		
		$scope.infowindow = infowindow;
    // $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };
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
			addMarkerLL($scope.query.dur, $scope.query.loc);
      // $scope.query.stops.push("");
      // $scope.query.durs.push("");
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

    $scope.getLocation = FareRoute.getLocation;
		
  });