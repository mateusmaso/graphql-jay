"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = swapiGraphQL;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _graphql = require("graphql");

var _perf = require("../../../perf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = "http://localhost:8080";

function swapiGraphQL() {
  return (0, _perf.monitorFetch)(_isomorphicFetch2.default)(url, {
    body: JSON.stringify({
      query: _graphql.introspectionQuery
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then(function (response) {
    return response.json();
  }).then(function (response) {
    var wrapper = {
      Root: {
        "allFilms": "allFilms.films"
      },
      Film: {
        "characters": "characterConnection.characters",
        "starships": "starshipConnection.starships",
        "vehicles": "vehicleConnection.vehicles"
      },
      Planet: {
        "residents": "residentConnection.residents"
      },
      Vehicle: {
        "pilots": "pilotConnection.pilots"
      },
      Starship: {
        "pilots": "pilotConnection.pilots"
      }
    };

    return {
      url: url,
      metadata: response.data,
      wrapper: wrapper
    };
  });
}