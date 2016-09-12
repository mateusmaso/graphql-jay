'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.reduceASTs = reduceASTs;

var _keypath = require('keypath');

var _keypath2 = _interopRequireDefault(_keypath);

var _traverse = require('traverse');

var _traverse2 = _interopRequireDefault(_traverse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function reduceASTs(rootAST) {
  for (var _len = arguments.length, asts = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    asts[_key - 1] = arguments[_key];
  }

  var rootFields = fieldsFor(rootAST);

  asts.sort(function (ast) {
    return heuristic(rootFields, ast);
  }).reverse();

  asts.forEach(function (ast) {
    var index = asts.indexOf(ast);
    var fields = fieldsFor(ast);

    asts.slice(index + 1).forEach(function (_ast) {
      reduceAST(_ast, fields);
    });
  });
}

function reduceAST(ast, fields) {
  fields.forEach(function (field) {
    if ((0, _keypath2.default)(field, ast)) {
      var _ = field.split(".");
      var lastKey = _[_.length - 1];
      _.pop();
      var key = _.join(".");
      var obj = (0, _keypath2.default)(key, ast);
      delete obj[lastKey];
    }
  });
}

function heuristic(rootFields, ast) {
  var fields = fieldsFor(ast);
  var totalFields = rootFields.length;
  var totalFieldsIncluded = 0;
  var totalFieldsExtra = 0;

  fields.forEach(function (field) {
    if (rootFields.indexOf(field) >= 0) {
      totalFieldsIncluded++;
    } else {
      totalFieldsExtra++;
    }
  });

  return totalFieldsIncluded / totalFields * (1 - 0.01 * totalFieldsExtra);
}

function fieldsFor(ast) {
  var fields = [];

  (0, _traverse2.default)(ast).forEach(function (value) {
    var isFields = this.path[this.path.length - 2] == "fields";

    if (isFields) {
      fields.push(this.path.join("."));
    }
  });

  return fields;
}