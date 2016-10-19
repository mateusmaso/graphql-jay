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

  var rootFieldPaths = fieldPathsFor(rootAST);

  asts.sort(function (ast) {
    return heuristic(rootFieldPaths, ast);
  }).reverse();

  asts.forEach(function (ast) {
    var index = asts.indexOf(ast);
    var fieldPaths = fieldPathsFor(ast);

    asts.slice(index + 1).forEach(function (_ast) {
      reduceAST(_ast, fieldPaths);
    });
  });
}

function deleteFieldPath(ast, fieldPath) {
  var keys = fieldPath.split(".");
  var lastKey = keys[keys.length - 1];
  keys.pop();
  var key = keys.join(".");
  var obj = (0, _keypath2.default)(key, ast);
  delete obj[lastKey];
}

function reduceAST(ast, fieldPaths) {
  var objectFieldPaths = [];

  fieldPaths.forEach(function (fieldPath) {
    var field = (0, _keypath2.default)(fieldPath, ast);

    if (field) {
      if (Object.keys(field.fields).length > 0) {
        objectFieldPaths.push(fieldPath);
      } else {
        deleteFieldPath(ast, fieldPath);
      }
    }
  });

  objectFieldPaths.reverse().forEach(function (objectFieldPath) {
    var field = (0, _keypath2.default)(objectFieldPath, ast);

    if (Object.keys(field.fields).length == 0) {
      deleteFieldPath(ast, objectFieldPath);
    }
  });
}

function heuristic(rootFieldPaths, ast) {
  var fieldPaths = fieldPathsFor(ast);
  var totalFields = rootFieldPaths.length;
  var totalFieldsIncluded = 0;
  var totalFieldsExtra = 0;

  fieldPaths.forEach(function (fieldPath) {
    if (rootFieldPaths.indexOf(fieldPath) >= 0) {
      totalFieldsIncluded++;
    } else {
      totalFieldsExtra++;
    }
  });

  return totalFieldsIncluded / totalFields * (1 - 0.01 * totalFieldsExtra);
}

function fieldPathsFor(ast) {
  var fieldPaths = [];

  (0, _traverse2.default)(ast).forEach(function (value) {
    var isFields = this.path[this.path.length - 2] == "fields";

    if (isFields) {
      fieldPaths.push(this.path.join("."));
    }
  });

  return fieldPaths;
}