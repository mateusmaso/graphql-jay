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

var __fetchingTime = 0;
var responseSize = 0;
var requestCount = 0;
var metadataFetchingTime = 0;
var processingTime = 0;

function monitorFetch(fetch) {
  return function () {
    requestCount++;
    var time = (0, _performanceNow2.default)();

    return fetch.apply(this, arguments).then(function (response) {
      __fetchingTime += (0, _performanceNow2.default)() - time;
      return response.clone().text().then(function (text) {
        responseSize += text.length;
        return response;
      });
    });
  };
}

function monitorGraphQL(graphql) {
  return function () {
    var time = (0, _performanceNow2.default)();

    return graphql.apply(this, arguments).then(function (response) {
      processingTime += (0, _performanceNow2.default)() - time - __fetchingTime;
      __fetchingTime = 0;
      return response;
    });
  };
}

function monitorComposeSchema(composeSchema) {
  return function () {
    var time = (0, _performanceNow2.default)();

    return composeSchema.apply(this, arguments).then(function (response) {
      processingTime += (0, _performanceNow2.default)() - time - __fetchingTime;
      metadataFetchingTime = __fetchingTime;
      responseSize = 0;
      requestCount = 0;
      __fetchingTime = 0;
      return response;
    });
  };
}

function perf() {
  var data = {
    responseSize: responseSize,
    requestCount: requestCount,
    metadataFetchingTime: metadataFetchingTime,
    processingTime: processingTime
  };

  responseSize = 0;
  requestCount = 0;
  metadataFetchingTime = 0;
  processingTime = 0;

  return data;
}