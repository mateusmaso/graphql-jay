"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.unwrapAST = unwrapAST;

var _clone = require("clone");

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function unwrapAST(ast, schema) {
  var wrapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  ast = (0, _clone2.default)(ast);

  var unwrapFields = function unwrapFields(type, fields) {
    var wrap = wrapper[type.name];
    var nextFields = {};

    if (wrap) {
      Object.keys(wrap).forEach(function (wrapFieldName) {
        var wrapPath = wrap[wrapFieldName];

        if (fields[wrapFieldName]) {
          var _wrapPath$split = wrapPath.split(".");

          var _wrapPath$split2 = _slicedToArray(_wrapPath$split, 2);

          var firstFieldName = _wrapPath$split2[0];
          var secondFieldName = _wrapPath$split2[1];


          fields[firstFieldName] = {
            fields: _defineProperty({}, secondFieldName, fields[wrapFieldName]),
            args: []
          };

          if (firstFieldName != wrapFieldName) {
            delete fields[wrapFieldName];
          } else {
            nextFields[firstFieldName] = fields[firstFieldName].fields[secondFieldName].fields;
          }
        }
      });
    }

    Object.keys(fields).forEach(function (fieldName) {
      var field = fields[fieldName];

      if (type.getFields && type.getFields()[fieldName]) {
        var typeField = type.getFields()[fieldName];
        unwrapFields(typeField.type.ofType || typeField.type, nextFields[fieldName] || field.fields);
      }
    });
  };

  unwrapFields(schema.getQueryType(), ast.fields);

  return ast;
}