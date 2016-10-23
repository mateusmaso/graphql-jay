"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = q3;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _utils = require("../../utils");

var _groupBy = require("group-by");

var _groupBy2 = _interopRequireDefault(_groupBy);

var _perf = require("../../../perf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function q3() {
  return new Promise(function (resolve) {
    (0, _perf.monitorFetch)(_isomorphicFetch2.default)("http://localhost:8000/api/films/1").then(function (response) {
      return response.json();
    }).then(function (aNewHope) {
      return (0, _utils.resolveField)(aNewHope, "starships").then(function () {
        return _bluebird2.default.each(aNewHope.starships, function (starship) {
          return (0, _utils.resolveField)(starship, "pilots");
        });
      }).then(function () {
        return (0, _utils.resolveField)(aNewHope, "vehicles").then(function () {
          return _bluebird2.default.each(aNewHope.vehicles, function (vehicle) {
            return (0, _utils.resolveField)(vehicle, "pilots");
          });
        });
      }).then(function () {
        var pilots = [];

        aNewHope.starships.forEach(function (starship) {
          starship.pilots.forEach(function (pilot) {
            pilots.push(pilot);
          });
        });

        aNewHope.vehicles.forEach(function (vehicle) {
          vehicle.pilots.forEach(function (pilot) {
            pilots.push(pilot);
          });
        });

        var pilotsByName = (0, _groupBy2.default)(pilots, "name");

        var pilotNames = Object.keys(pilotsByName).sort(function (a, b) {
          return pilotsByName[a].length > pilotsByName[b].length;
        });

        resolve("Q3: " + pilotNames[0]);
      });
    }).catch(function () {
      resolve("Q3: ?");
    });
  });
}