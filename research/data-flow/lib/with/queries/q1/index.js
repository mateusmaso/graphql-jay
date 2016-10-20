"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = q1;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _graphql = require("graphql");

var _graphqlJay = require("graphql-jay");

var _perf = require("../../../perf");

var _perf2 = _interopRequireDefault(_perf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function q1(services) {
  _perf2.default.schemaCreation();
  return new Promise(function (resolve) {
    _graphqlJay.composeSchema.apply(undefined, _toConsumableArray(services)).then(function (schema) {
      _perf2.default.schemaCreationEnd();
      _perf2.default.schemaFetching();

      (0, _graphql.graphql)(schema, "{\n        allFilms {\n          title\n          characters {\n            homeworld {\n              climate\n            }\n          }\n        }\n      }").then(function (response) {
        _perf2.default.schemaFetchingEnd();

        var films = response.data.allFilms;
        var filmWithDesertCharacters = films.map(function (film) {
          var count = 0;

          film.characters.forEach(function (character) {
            if (character.homeworld.climate.indexOf("arid") >= 0) {
              count++;
            }
          });

          return {
            film: film,
            count: count
          };
        });

        filmWithDesertCharacters.sort(function (a, b) {
          return a.count < b.count;
        });

        resolve("Q1: " + filmWithDesertCharacters[0].film.title);
      });
    });
  });
}