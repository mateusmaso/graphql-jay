"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = q3;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _graphql = require("graphql");

var _groupBy = require("group-by");

var _groupBy2 = _interopRequireDefault(_groupBy);

var _perf = require("../../../perf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function q3(schema) {
  return new Promise(function (resolve) {
    return (0, _perf.monitorGraphQL)(_graphql.graphql)(schema, "{\n      film(filmID: 1) {\n        starships {\n          pilots {\n            name\n          }\n        }\n        vehicles {\n          pilots {\n            name\n          }\n        }\n      }\n    }").then(function (response) {
      var aNewHope = response.data.film;
      var pilots = [];

      aNewHope.starships.forEach(function (starship) {
        starship.pilots.forEach(function (pilot) {
          pilots.push(pilot);
        });
      });

      aNewHope.vehicles.forEach(function (vehicle) {
        vehicle.pilots.forEach(function (pilot) {
          pilots.push(pilot);
        });
      });

      var pilotsByName = (0, _groupBy2.default)(pilots, "name");

      var pilotNames = Object.keys(pilotsByName).sort(function (a, b) {
        return pilotsByName[a].length > pilotsByName[b].length;
      });

      resolve("Q3: " + pilotNames[0]);
    }).catch(function () {
      resolve("Q3: ?");
    });
  });
}