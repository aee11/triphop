'use strict';
var _ = require('lodash');
var url = require('url');
var request = require('request');
var template = require('url-template');
var moment = require('moment');
var async = require('async');
var BASE_URL = require('../../config/local.env').DOHOP_API_BASEURL;
var BASE_PATH = template.parse('/api/v1/livestore/en/{user-country}/per-airport/{departure-airport}/{arrival-airports}/{date-from}/{date-to}?id=H4cK3r&currency={currency}&b_max=1&fare-format=full&airport-format=full');

exports.getLowestFare = function(depAirport, depDateFrom, depDateTo, arrivalLegs, options, cb) {
  var departureDateFrom = depDateFrom.format('YYYY-MM-DD');
  var departureDateTo = depDateTo.format('YYYY-MM-DD');
  var arrivalAirports;
  if (_.isPlainObject(arrivalLegs)) {
    arrivalAirports = _.keys(arrivalLegs);
  } else {
    arrivalAirports = arrivalLegs;
  }
  console.log(arrivalAirports);
  var basePath = BASE_PATH.expand({
    'user-country': options.userCountry,
    'departure-airport': depAirport,
    'arrival-airports': arrivalAirports,
    'date-from': departureDateFrom,
    'date-to': departureDateTo,
    currency: options.currency
  });
  var requestURL = url.resolve(BASE_URL, basePath)
  console.log(requestURL);
  request({url: requestURL, json: true}, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if (body.fares.length < 1) { // No flights found
        console.log('No flights found from ' + depAirport + ' to ' + arrivalAirports + '. ' + departureDateFrom + ' - ' + departureDateTo);
        return cb('No flights found', null);
      }
      // TODO: Check the ratio of body.fares.length and arrivalAirports.length?
      //       If the ratio is too big, retry with wider time criteria.
      // if (body.fares.length/arrivalAirports.length < 0.2) {
      //   return cb('Too few flights found', null);
      // }
      var nextDestinationIndex = _.findIndex(arrivalAirports, function(multipleAirportCodes) {
        return multipleAirportCodes.indexOf(body.fares[0].b) > -1;
      });
      var lowestFare = body.fares[0];
      var airports = body.airports;
      var fareInformation = {
        lowestFare: lowestFare, 
        airports: airports, 
        nextDestination: arrivalAirports[nextDestinationIndex]
      };
      cb(null, fareInformation);
    } else {
      cb('Error', null);
    }
  });
};

// var TSP_PATH = template.parse('/api/v1/livestore/en/{user-country}/per-airport/{departure-airport}/{arrival-airports}/{date-from}/{date-to}?id=H4cK3r&currency={currency}&b_max=1&fare-format=full&airport-format=full');
exports.getAllFares = function(airports, dates, options, cb) {
  var tspPath = template.parse('/api/v1/livestore/en/' + options.userCountry + '/per-airport/' + airports + '/' + airports + '/{date-from}/{date-to}?id=H4cK3r&b_max=10&fare-format=full&airport-format=full&currency=' + options.currency);
  var requestQueries = _.map(dates, function(date) {
    return url.resolve(BASE_URL, tspPath.expand({
      'date-from': moment(date).subtract(1,'days').format('YYYY-MM-DD'),
      'date-to': moment(date).add(1,'days').format('YYYY-MM-DD')
    }));
  });
  console.log(requestQueries);
  var fares = []
  async.each(requestQueries, function(requestQuery, callback) {
    request({url: requestQuery, json: true}, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('Found ' + body.fares.length + 'fares');
        fares.push(body.fares);
        callback();
      } else {
        callback(error);
      }
    });
  }, function (err) {
    if (!err) {
      console.log('finished ' + requestQueries.length + ' queries.');
      cb(null, fares);
    } else {
      cb(err, null);
    }
  });
};



exports.createAllPossibleDates = function(depDateFrom, legs) {
  var possibleDates = [];
  console.log('legs: ' +legs);
  var powersetOfDurations = powerset(legs);
  possibleDates = _.map(powersetOfDurations, function(arr) {
    return depDateFrom.clone().add(_.sum(arr), 'days').format('YYYY-MM-DD');
  });
  return possibleDates;
}

function powerset(ary) {
  var ps = [[]];
  for (var i=0; i < ary.length; i++) {
    for (var j = 0, len = ps.length; j < len; j++) {
      ps.push(ps[j].concat(ary[i]));
    }
  }
  return ps;
}