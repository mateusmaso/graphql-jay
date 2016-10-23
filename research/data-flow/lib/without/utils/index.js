"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveField = resolveField;

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _perf = require("../../perf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolveField(object, fieldName) {
  var field = object[fieldName];

  if (Array.isArray(field)) {
    object[fieldName] = [];

    return _bluebird2.default.each(field, function (url) {
      return (0, _perf.monitorFetch)(fetch)(url).then(function (response) {
        return response.json();
      }).then(function (response) {
        object[fieldName].push(response);
      });
    });
  } else {
    return (0, _perf.monitorFetch)(fetch)(field).then(function (response) {
      return response.json();
    }).then(function (response) {
      object[fieldName] = response;
    });
  }
}