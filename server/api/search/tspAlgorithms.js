'use strict';

var _ = require('lodash');
var moment = require('moment');
var dohop = require('./dohop');
var async = require('async');
var combinatorics = require('js-combinatorics').Combinatorics;
var maxRetries = 5;
var maxNNIterations = 25;

exports.nearestNeighbour = function(depAirport, depDateFrom, depDateTo, unvisitedLegs, options, cb) {
  var route = [];
  var airportsOnRoute = {};
  var homeAirport = depAirport;
  var isSearchingForHomeFare = false;
  var iterations = 0;
  var retries = 0;
  async.whilst(
    function () { return _.size(unvisitedLegs) > 0 && iterations < maxNNIterations && retries < maxRetries; },
    function (callback) {
      iterations++;
      dohop.getLowestFare(depAirport, depDateFrom, depDateTo, unvisitedLegs, options, function (err, fareInfo) {
        if (err) {
          // No fares found, search criteria widened via date:
          retries++;
          if (depDateTo.diff(depDateFrom, 'days') >= 6) {
            depDateTo.add(3, 'days');
          } else {
            depDateFrom.subtract(1, 'days');
            depDateTo.add(2, 'days');
          }
          return callback();
        }
        retries = 0;
        _.merge(airportsOnRoute, fareInfo.airports);
        var fare = fareInfo.lowestFare;
        var nextDestination = fareInfo.nextDestination;
        console.log(fare);
        route.push(fare);

        var depDateNext = moment(fare.d1).add(unvisitedLegs[nextDestination], 'days');
        console.log('Next flight on: ' + depDateNext.format('YYYY-MM-DD'));
        depDateFrom = depDateNext.clone();
        depDateTo = depDateNext.clone();

        unvisitedLegs = _.omit(unvisitedLegs, nextDestination);
        if (_.size(unvisitedLegs) < 1 && !isSearchingForHomeFare) {
          isSearchingForHomeFare = true;
          unvisitedLegs[homeAirport] = 0;
        }
        depAirport = nextDestination;
        console.log('Next dest: ' + nextDestination);
        console.log('Currently unvisited: ', unvisitedLegs);
        callback();
      });
    },
    function (err) {
      if (!err) {
        cb(null, {route: route, airportsOnRoute: airportsOnRoute});
      } else {
        cb(err, null);
      }
    }
  );
};

exports.tdtsp = function (startingAirports, depDateFrom, depDateTo, legs, options, cb) {
  var possibleDates = dohop.createAllPossibleDates(depDateFrom, _.values(legs));
  var possibleLocations = getMostPopularAirportPerDestination(startingAirports, _.keys(legs));
  console.log('Possible dates: ' + possibleDates);
  console.log('Possible locations: ' + possibleLocations);
  dohop.getAllFares(possibleLocations, possibleDates, options, function (err, fares) {
    if (!err) {
      var singleStartingAirport = startingAirports.substring(0,3);
      var singleAirportLegs = getSingleAirportLegs(legs);
      var bestRoute = travelingSalesmanCandidates(fares, depDateFrom, 
        singleStartingAirport, singleAirportLegs, function(err, sortedCandidateRoutes) {
          var bestRoute = _.first(sortedCandidateRoutes);
          console.log('Best route found: ');
          console.log(bestRoute);
          cb(null, bestRoute);
        });
    } else {
      cb(err, null);
    }
  });
};

var getMostPopularAirportPerDestination = function(airports, arrayOfAirports) {
  var popularAirports = _.map(arrayOfAirports, function (airportCodes) {
    return airportCodes.substring(0,3);
  });
  popularAirports.push(airports.substring(0,3));
  return popularAirports;
}

var getSingleAirportLegs = function(legs) {
  var singleAirportLegs = {};
  _.forEach(legs, function (dur, leg) {
    singleAirportLegs[leg.substring(0,3)] = dur; 
  });
  return singleAirportLegs;
}

var travelingSalesmanCandidates = function (faredata, currentDate, currentAirport, unvisitedLegs, cb) {
  var possibleRoutes = combinatorics.permutation(_.keys(unvisitedLegs)).toArray();
  var candidateRoutes = [];
  console.log('Testing each possible route');
  async.each(possibleRoutes, function (route, callback) {
    var routeFares = [];
    var startDate = currentDate.clone();
    route.unshift(currentAirport);
    route.push(currentAirport);
    var totalPrice = 0;
    for (var i = 1; i < route.length; i++) {
      var faresOnDate = faredata[startDate.format('YYYY-MM-DD')];
      // console.log(faresOnDate);
      var cheapestFlightToNextLoc = _.find(faresOnDate, function(fare) {
        return fare.a == route[i-1] && fare.b === route[i];
      });
      if (typeof cheapestFlightToNextLoc !== 'undefined') {
        routeFares.push(cheapestFlightToNextLoc);
        totalPrice += cheapestFlightToNextLoc.conv_fare;
        startDate.add(unvisitedLegs[route[i]], 'days');
      } else {
        break;
      }
    }
    if (i == route.length) {
      routeFares.totalPrice = totalPrice;
      candidateRoutes.push(routeFares);
    }
    callback();
  }, function (err) {
    if (!err) {
      var lowestPrice = 0;
      var sortedCandidateRoutes = _.sortBy(candidateRoutes, function (candidateRoute) {
        return candidateRoute.totalPrice;
      });
      return cb(null, sortedCandidateRoutes);
    } else {
      return cb(err, candidateRoutes);
    }
  });
};
