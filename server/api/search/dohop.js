'use strict';
var _ = require('lodash');
var url = require('url');
var request = require('request');
var template = require('url-template');
var moment = require('moment');
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
      var lowestFare = body.fares[0];
      var airports = body.airports;
      var fareWithAirports = {lowestFare: lowestFare, airports: airports};
      cb(null, fareWithAirports);
    } else {
      cb('Error', null);
    }
  });
};