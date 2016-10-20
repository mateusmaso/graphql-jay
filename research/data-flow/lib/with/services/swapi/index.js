"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = swapi;

var _graphqlJayHyperschema = require("graphql-jay-hyperschema");

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _perf = require("../../../perf");

var _perf2 = _interopRequireDefault(_perf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = "http://localhost:8000/api";

function swapi() {
  return (0, _isomorphicFetch2.default)(url + "/schema").then(function (response) {
    return response.json();
  }).then(function (schema) {
    var wrapper = {
      Query: {
        "allFilms": "allFilms.results"
      }
    };

    return {
      url: url,
      schema: schema,
      adapter: _graphqlJayHyperschema.adapter,
      wrapper: wrapper,
      fetch: _perf2.default.monitorFetch(_isomorphicFetch2.default)
    };
  });
}