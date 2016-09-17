"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchData = fetchData;

var _isomorphicFetch = require("isomorphic-fetch");

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _deepAssign = require("deep-assign");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function fetchData() {
  for (var _len = arguments.length, requests = Array(_len), _key = 0; _key < _len; _key++) {
    requests[_key] = arguments[_key];
  }

  return Promise.all(requests.map(function (request) {
    return performRequest(request);
  })).then(function (responses) {
    return _deepAssign2.default.apply(undefined, _toConsumableArray(responses)).data;
  });
}

function performRequest(request) {
  return Promise.all(request.map(function (link) {
    var href = link.href;
    var next = link.next;


    return (0, _isomorphicFetch2.default)(href, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      return response.json();
    });
  })).then(function (responses) {
    return _deepAssign2.default.apply(undefined, _toConsumableArray(responses));
  });
}