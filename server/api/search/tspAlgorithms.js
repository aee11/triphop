'use strict';

var _ = require('lodash');
var moment = require('moment');
var dohop = require('./dohop');

exports.nearestNeighbour = function(startAirport, startDate, unvisitedAirport) {
  var route = [];
  while (_.size(unvisitedAirport) > 0) {
    var fare = dohop.getLowestFare(startAirport, startDate, unvisitedAirport);
    route.push(fare);
    unvisitedAirport = _.omit(unvisitedAirport, fare.b);
    startDate.add(fare.durationOfStay);
  }
  return route;
};