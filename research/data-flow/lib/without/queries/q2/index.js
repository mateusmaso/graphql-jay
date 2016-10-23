"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = q2;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _utils = require("../../utils");

var _groupBy = require("group-by");

var _groupBy2 = _interopRequireDefault(_groupBy);

var _perf = require("../../../perf");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function q2() {
  return new Promise(function (resolve) {
    (0, _perf.monitorFetch)(_isomorphicFetch2.default)("http://localhost:8000/api/planets/1").then(function (response) {
      return response.json();
    }).then(function (tatooine) {
      (0, _utils.resolveField)(tatooine, "residents").then(function () {
        return _bluebird2.default.each(tatooine.residents, function (resident) {
          return (0, _utils.resolveField)(resident, "species");
        });
      }).then(function () {
        var residentsBySpecies = (0, _groupBy2.default)(tatooine.residents, function (resident) {
          var name;

          resident.species.forEach(function (specie) {
            if (name) {
              name = name + " & " + specie.name;
            } else {
              name = specie.name;
            }
          });

          return name || "Unknown";
        });

        var specieNames = Object.keys(residentsBySpecies).sort(function (a, b) {
          return residentsBySpecies[a].length > residentsBySpecies[b].length;
        });

        resolve("Q2: " + specieNames[0]);
      });
    });
  });
}