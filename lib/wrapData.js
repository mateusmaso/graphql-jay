"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.wrapData = wrapData;
function wrapData(data, schema) {
  var wrapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var wrapFields = function wrapFields(type, fields) {
    var wrap = wrapper[type.name];

    if (wrap) {
      Object.keys(wrap).forEach(function (wrapFieldName) {
        var wrapPath = wrap[wrapFieldName];

        var _wrapPath$split = wrapPath.split("."),
            _wrapPath$split2 = _slicedToArray(_wrapPath$split, 2),
            firstFieldName = _wrapPath$split2[0],
            secondFieldName = _wrapPath$split2[1];

        var fieldsList = [fields];

        if (Array.isArray(fields)) {
          fieldsList = fields;
        }

        fieldsList.forEach(function (fields) {
          if (fields[firstFieldName] && fields[firstFieldName][secondFieldName]) {
            fields[wrapFieldName] = fields[firstFieldName][secondFieldName];

            if (wrapFieldName != firstFieldName) {
              delete fields[firstFieldName];
            }

            var typeField = type.getFields()[firstFieldName].type.getFields()[secondFieldName];

            if (_typeof(fields[wrapFieldName]) == "object") {
              wrapFields(typeField.type.ofType || typeField.type, fields[wrapFieldName]);
            }
          }
        });
      });
    }

    Object.keys(fields).forEach(function (fieldName) {
      var field = fields[fieldName];

      if (type.getFields && type.getFields()[fieldName]) {
        var typeField = type.getFields()[fieldName];
        wrapFields(typeField.type.ofType || typeField.type, field);
      }
    });
  };

  wrapFields(schema.getQueryType(), data);

  return data;
}