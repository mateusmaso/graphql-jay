"use strict";

var _with = require("./with");

var _with2 = _interopRequireDefault(_with);

var _without = require("./without");

var _without2 = _interopRequireDefault(_without);

var _perf = require("./perf");

var _perf2 = _interopRequireDefault(_perf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _with2.default)().then(function () {
  console.log(_perf2.default.clean());
  return (0, _without2.default)();
}).then(function () {
  console.log(_perf2.default.clean());
});