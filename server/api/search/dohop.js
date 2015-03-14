'use strict';
var url = require('url');
var template = require('url-template');
var BASE_URL = require('../../config/local.env').DOHOP_API_BASEURL;
var BASE_PATH = template.parse('/api/v1/livestore/{language}/{user-country}/per-country/{departure-airport}/{date-from}/{date-to}?id=H4cK3r&currency={currency}&fare-format=full&airport-format=compact');

exports.createRequestURL = function(query) {
  var basePath = BASE_PATH.expand(query);
  return url.resolve(BASE_URL, basePath);
};

exports.getLowestFare = function(departureAirport, departureDateFrom, arrivalAirports, options) {
  return {};
};