"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = graph3;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url = "http://localhost:8080/api/graph-3";

function graph3() {
  return (0, _isomorphicFetch2.default)(url, {
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
    return {
      url: url,
      schema: response.data
    };
  });
};