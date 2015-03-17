'use strict';

var express = require('express');
var controller = require('./search.controller');

var router = express.Router();

router.get('/nn', controller.nearestNeighbour);
router.get('/tdtsp', controller.timeDependentTravelingSalesman);

module.exports = router;