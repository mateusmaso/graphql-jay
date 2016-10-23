"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.monitorFetch = monitorFetch;
exports.monitorGraphQL = monitorGraphQL;
exports.monitorComposeSchema = monitorComposeSchema;
exports.default = perf;

var _performanceNow = require("performance-now");

var _performanceNow2 = _interopRequireDefault(_performanceNow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var responseTime = 0;
var responseSize = 0;
var requestCount = 0;
var overheadTime = 0;

function monitorFetch(fetch) {
  return function () {
    requestCount++;
    var fetchTime = (0, _performanceNow2.default)();

    return fetch.apply(this, arguments).then(function (response) {
      responseTime += (0, _performanceNow2.default)() - fetchTime;
      return response.clone().text().then(function (text) {
        responseSize += text.length;
        return response;
      });
    });
  };
}

function monitorGraphQL(graphql) {
  return function () {
    var queryTime = (0, _performanceNow2.default)();

    return graphql.apply(this, arguments).then(function (response) {
      overheadTime += (0, _performanceNow2.default)() - queryTime;
      return response;
    });
  };
}

function monitorComposeSchema(composeSchema) {
  return function () {
    var composeTime = (0, _performanceNow2.default)();

    return composeSchema.apply(this, arguments).then(function (response) {
      overheadTime += (0, _performanceNow2.default)() - composeTime;
      return response;
    });
  };
}

function perf() {
  if (overheadTime != 0) {
    overheadTime = overheadTime - responseTime;
  }

  var data = {
    responseTime: responseTime,
    responseSize: responseSize,
    requestCount: requestCount,
    overheadTime: overheadTime
  };

  responseTime = 0;
  responseSize = 0;
  requestCount = 0;
  overheadTime = 0;

  return data;
}