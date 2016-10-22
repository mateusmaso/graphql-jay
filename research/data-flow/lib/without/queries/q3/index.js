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

var _perf2 = _interopRequireDefault(_perf);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function q3() {
  return new Promise(function (resolve) {
    _perf2.default.monitorFetch(_isomorphicFetch2.default)("http://localhost:8000/api/films/1").then(function (response) {
      return response.json();
    }).then(function (aNewHope) {
      (0, _utils.resolveField)(aNewHope, "starships").then(function () {
        return (0, _utils.resolveField)(aNewHope, "vehicles");
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
    });
  });
}