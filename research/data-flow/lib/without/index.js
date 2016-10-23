"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = run;

var _queries = require("./queries");

function run() {
  return Promise.all([(0, _queries.q1)(), (0, _queries.q2)(), (0, _queries.q3)()]);
}