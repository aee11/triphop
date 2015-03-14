'use strict';

var _ = require('lodash');
var request = require('request');
var dohop = require('./dohop');
var tspAlgorithms = require('./tspAlgorithms');

// Get list of flights
exports.index = function(req, res) {
  console.log(req.query);
  res.json(req.query)
  // var requestURL = dohop.createRequestURL(req.query);
  // console.log(requestURL);
  // request(requestURL, function (error, response, body) {
  //   if (!error && response.statusCode == 200) {
  //     res.send(JSON.parse(body)); // Show the HTML for the Google homepage.
  //   }
  // });
};