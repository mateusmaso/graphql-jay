"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = q2;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _graphql = require("graphql");

var _graphqlJay = require("graphql-jay");

var _groupBy = require("group-by");

var _groupBy2 = _interopRequireDefault(_groupBy);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function q2(services) {
  return new Promise(function (resolve) {
    _graphqlJay.composeSchema.apply(undefined, _toConsumableArray(services)).then(function (schema) {
      return (0, _graphql.graphql)(schema, "{\n        planet(planetID: 1) {\n          residents {\n            species {\n              name\n            }\n          }\n        }\n      }").then(function (response) {
        var tatooine = response.data.planet;

        var residentsBySpecies = (0, _groupBy2.default)(tatooine.residents, function (resident) {
          var name;

          resident.species.forEach(function (specie) {
            if (name) {
              name = name + " & " + specie.name;
            } else {
              name = specie.name;
            }
          });

          return name || "Unknown";
        });

        var specieNames = Object.keys(residentsBySpecies).sort(function (a, b) {
          return residentsBySpecies[a].length > residentsBySpecies[b].length;
        });

        resolve("Q2: " + specieNames[0]);
      });
    });
  });
}