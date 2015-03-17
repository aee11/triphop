'use strict';

angular.module('triphopApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('landing', {
        url: '/landing',
        templateUrl: 'app/landing/landing.html',
        controller: 'LandingCtrl'
      });
  });