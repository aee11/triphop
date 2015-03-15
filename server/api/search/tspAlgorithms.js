'use strict';

var _ = require('lodash');
var moment = require('moment');
var dohop = require('./dohop');
var async = require('async');

var maxRetries = 5;
var maxNNIterations = 25;

exports.nearestNeighbour = function(depAirport, depDateFrom, depDateTo, unvisitedLegs, options, cb) {
  var route = [];
  var homeAirport = depAirport;
  var isSearchingForHomeFare = false;
  var iterations = 0;
  var retries = 0;
  async.whilst(
    function () { return _.size(unvisitedLegs) > 0 && iterations < maxNNIterations && retries < maxRetries; },
    function (callback) {
      iterations++;
      dohop.getLowestFare(depAirport, depDateFrom, depDateTo, unvisitedLegs, options, function (err, fare) {
        if (err) {
          // No fares found, search criteria widened via date:
          maxRetries++;
          if (depDateTo.diff(depDateFrom, 'days') >= 6) {
            depDateTo.add(3, 'days');
          } else {
            depDateFrom.subtract(1, 'days');
            depDateTo.add(2, 'days');
          }
          return callback();
        }
        retries = 0;
        console.log(fare);
        route.push(fare);

        var depDateNext = moment(fare.d1).add(unvisitedLegs[fare.b], 'days');
        console.log('Next flight on: ' + depDateNext.format('YYYY-MM-DD'));
        depDateFrom = depDateNext.clone();
        depDateTo = depDateNext.clone();

        unvisitedLegs = _.omit(unvisitedLegs, fare.b);
        if (_.size(unvisitedLegs) < 1 && !isSearchingForHomeFare) {
          isSearchingForHomeFare = true;
          unvisitedLegs[homeAirport] = 0;
        }
        depAirport = fare.b;
        console.log('Next dest: ' + fare.b);
        console.log('Currently unvisited: ', unvisitedLegs);
        callback();
      });
    },
    function (err) {
      if (!err) {
        cb(null, route);
      } else {
        cb(err, null);
      }
    }
  );

};