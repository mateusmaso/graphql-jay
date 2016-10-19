"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = q3;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _graphql = require("graphql");

var _graphqlJay = require("graphql-jay");

var _groupBy = require("group-by");

var _groupBy2 = _interopRequireDefault(_groupBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function q3(services) {
  return new Promise(function (resolve) {
    _graphqlJay.composeSchema.apply(undefined, _toConsumableArray(services)).then(function (schema) {
      return (0, _graphql.graphql)(schema, "{\n        film(filmID: 1) {\n          starships {\n            pilots {\n              name\n            }\n          }\n          vehicles {\n            pilots {\n              name\n            }\n          }\n        }\n      }").then(function (response) {
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
      });
    });
  });
}