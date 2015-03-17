'use strict';

angular.module('triphopApp')
  .controller('LandingCtrl', function ($scope) {
    $scope.showParam = true;

    // ***** Query

    $scope.query = {
      startLoc: "",
      stops: [""],
      durs: [""]
    };

    // ***** datePicker

    $scope.today = function() {
      $scope.query.startDate = new Date();
      $scope.query.startDate = $scope.query.startDate.toDateString();
    };
    $scope.today();

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
    $scope.format = 'dd MMMM yyyy';
    $scope.getLocation = FareRoute.getLocation;

    // ****** Random pictures

    $scope.bg_array = ['bg1.jpg', 'bg2.jpg', 'bg3.jpg', 'bg4.jpg','bg5.jpg','bg6.jpg'];
    $scope.num = Math.floor(Math.random() * $scope.bg_array.length);
    $scope.bgPicture = $scope.bg_array[$scope.num];
    $scope.imgStr = '<img src="assets/images/' + $scope.bgPicture + '" alt = "">';
    console.log($scope.imgStr);

    
  });
