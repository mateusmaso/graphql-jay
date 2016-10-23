"use strict";

var _with = require("./with");

var _with2 = _interopRequireDefault(_with);

var _without = require("./without");

var _without2 = _interopRequireDefault(_without);

var _perf = require("./perf");

var _perf2 = _interopRequireDefault(_perf);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildData(response) {
  var q1 = response[0] == "Q1: Revenge of the Sith";
  var q2 = response[1] == "Q2: Droid";
  var q3 = response[2] == "Q3: Chewbacca";

  var answerRate = (q1 + q2 + q3) / 3;

  return Object.assign({
    answerRate: answerRate
  }, (0, _perf2.default)());
}

function writeData(data) {
  return _fs2.default.writeFileSync('data.json', JSON.stringify(data, 0, 2));
}

function run() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  var discard = _ref.discard;

  var withData = {};
  var withoutData = {};

  return (0, _with2.default)().then(function (response) {
    withData = buildData(response);
    console.log(withData);
    return (0, _without2.default)();
  }).then(function (response) {
    withoutData = buildData(response);

    return {
      "with": withData,
      "without": withoutData
    };
  });
}

run().then(function () {
  return run();
}).then(function (data) {
  return writeData(data);
}).catch(function (error) {
  console.warn(error);
});