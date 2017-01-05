"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = q1;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _graphql = require("graphql");

var _perf = require("../../../perf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function q1(schema) {
  return new Promise(function (resolve) {
    return (0, _perf.monitorGraphQL)(_graphql.graphql)(schema, "{\n      allFilms {\n        title\n        characters {\n          homeworld {\n            climate\n          }\n        }\n      }\n    }").then(function (response) {
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
    }).catch(function () {
      resolve("Q1: ?");
    });
  });
}