"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _queries = require("./queries");

var _graphqlJay = require("graphql-jay");

var _services = require("./services");

var _perf = require("../perf");

function run() {
  return (0, _perf.monitorComposeSchema)(_graphqlJay.composeSchema)(_services.swapi).then(function (schema) {
    return Promise.all([(0, _queries.q1)(schema), (0, _queries.q2)(schema), (0, _queries.q3)(schema)]);
  });
}