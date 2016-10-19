"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = q1;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _utils = require("../../utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function q1() {
  return new Promise(function (resolve) {
    (0, _isomorphicFetch2.default)("http://localhost:8000/api/films").then(function (response) {
      return response.json();
    }).then(function (response) {
      var films = response.results;

      _bluebird2.default.each(films, function (film) {
        return (0, _utils.resolveField)(film, "characters").then(function () {
          return _bluebird2.default.each(film.characters, function (character) {
            return (0, _utils.resolveField)(character, "homeworld");
          });
        });
      }).then(function () {
        var filmWithDesertCharacters = films.map(function (film) {
          var count = 0;

          film.characters.forEach(function (character) {
            if (character.homeworld.climate.split(", ").indexOf("arid") >= 0) {
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