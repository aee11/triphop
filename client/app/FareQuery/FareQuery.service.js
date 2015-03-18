'use strict';

angular.module('triphopApp')
  .service('FareQuery', function () {
    var query = {
      stops: [],
      durs: [],
      dur: '',
      loc: ''
    };

    var setStartLocation = function(location) {
      query.startLoc = location;
    };

    var setStartDate = function(date) {
      query.startDate = date;
    };

    var addLeg = function(legLocation, duration) {
      query.stops.push(legLocation);
      query.durs.push(duration);
    };

    var removeLeg = function(legLocation) {
      var index = _.indexOf(query.stops, legLocation);
      if (index < 0) {
        console.log('leg not in query');
        return;
      } else {
        query.stops.splice(index, 1);
        query.durs.splice(index, 1);
      }
    };

    var getStartLocation = function() {
      return query.startLoc;
    };

    var getQuery = function() {
      return query;
    };

    return {
      setStartLocation: setStartLocation,
      setStartDate: setStartDate,
      addLeg: addLeg,
      removeLeg: removeLeg,
      getStartLocation: getStartLocation,
      getQuery: getQuery
    };

  });
