"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _performanceNow = require("performance-now");

var _performanceNow2 = _interopRequireDefault(_performanceNow);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var responseTime = 0;
var responseSize = 0;
var requestCount = 0;
var overheadTime = 0;

function monitorFetch(fetch) {
  return function (a) {
    requestCount++;
    var fetchTime = (0, _performanceNow2.default)();

    console.log(a);

    return fetch.apply(this, arguments).then(function (response) {
      responseTime += (0, _performanceNow2.default)() - fetchTime;
      return response.clone().text().then(function (text) {
        responseSize += text.length;
        return response;
      });
    });
  };
}

var schemaCreationTime;
var schemaFetchingTime;

function schemaCreation() {
  schemaCreationTime = (0, _performanceNow2.default)();
}

function schemaCreationEnd() {
  overheadTime += (0, _performanceNow2.default)() - schemaCreationTime;
  schemaCreationTime = 0;
}

function schemaFetching() {
  schemaFetchingTime = (0, _performanceNow2.default)();
}

function schemaFetchingEnd() {
  overheadTime += (0, _performanceNow2.default)() - schemaFetchingTime;
  schemaFetchingTime = 0;
}

function clean() {
  if (overheadTime != 0) {
    overheadTime -= responseTime;
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

var perf = {
  monitorFetch: monitorFetch,
  schemaCreation: schemaCreation,
  schemaCreationEnd: schemaCreationEnd,
  schemaFetching: schemaFetching,
  schemaFetchingEnd: schemaFetchingEnd,
  clean: clean
};

exports.default = perf;