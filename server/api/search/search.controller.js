'use strict';

var _ = require('lodash');
var request = require('request');
var moment = require('moment');
var dohop = require('./dohop');
var tspAlgorithms = require('./tspAlgorithms');

// Get list of flights
exports.nearestNeighbour = function(req, res) {
  // TODO: Change required params from queryParams to pathParams
  console.log(req.query);
  var unvisitedAirports = {};
  if (_.isString(req.query.legs)) {
    if (!_.isString(req.query.durs)) {
      return res.status(400).end();
    }
    unvisitedAirports[req.query.legs] = req.query.durs;
  } else {
    if (!_.isArray(req.query.legs) || !_.isArray(req.query.durs)) {
      return res.status(400).end();
    }
    if (req.query.legs.length !== req.query.durs.length) {
      return res.status(400).end();
    }
    unvisitedAirports = _.zipObject(req.query.legs, req.query.durs);
  }
  var startDate = moment(req.query.startDate);
  var options = _.pick(req.query, ['userCountry', 'currency']);
  tspAlgorithms.nearestNeighbour(req.query.startLoc, 
    startDate, startDate.clone(), unvisitedAirports, options, function (err, nnRoute) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(nnRoute);
      }
  });
};

exports.timeDependentTravelingSalesman = function (req, res) {
  console.log(req.query);
  var unvisitedAirports = {};
  if (_.isString(req.query.legs)) {
    if (!_.isString(req.query.durs)) {
      return res.status(400).end();
    }
    unvisitedAirports[req.query.legs] = req.query.durs;
  } else {
    if (!_.isArray(req.query.legs) || !_.isArray(req.query.durs)) {
      return res.status(400).end();
    }
    if (req.query.legs.length !== req.query.durs.length) {
      return res.status(400).end();
    }
    unvisitedAirports = _.zipObject(req.query.legs, req.query.durs);
  }
  var startDate = moment(req.query.startDate);
  var options = _.pick(req.query, ['userCountry', 'currency']);
  tspAlgorithms.tdtsp(req.query.startLoc, 
    startDate, startDate.clone(), unvisitedAirports, options, function (err, tspRoute) {
      if (err) {
        return res.send(err);
      } else {
        return res.json(tspRoute);
      }
  });
};