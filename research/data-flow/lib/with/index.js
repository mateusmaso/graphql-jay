"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _queries = require("./queries");

var _services = require("./services");

function run() {
  var services = [_services.swapi];

  return Promise.all([(0, _queries.q1)(services), (0, _queries.q2)(services), (0, _queries.q3)(services)]).then(function (response) {
    console.log("with", response);
  });
}