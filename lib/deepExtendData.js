"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deepExtendData = deepExtendData;

var _deepAssign = require("deep-assign");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function deepExtendData() {
  return _deepAssign2.default.apply(undefined, arguments);
}