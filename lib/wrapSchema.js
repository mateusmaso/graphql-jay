"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.wrapSchema = wrapSchema;

var _clone = require("clone");

var _clone2 = _interopRequireDefault(_clone);

var _graphql = require("graphql");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function wrapSchema(schema) {
  var wrapper = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return (0, _graphql.graphql)(schema, _graphql.introspectionQuery).then(function (response) {
    var schemaData = response.data;
    var types = schemaData.__schema.types;

    Object.keys(wrapper).forEach(function (typeName) {
      var wrap = wrapper[typeName];
      var type = types.find(function (type) {
        return type.name == typeName;
      });

      Object.keys(wrap).forEach(function (wrapFieldName) {
        var fieldName = wrap[wrapFieldName];
        var wrapField = (0, _clone2.default)(fieldpath(type.name, fieldName, types));

        type.fields = type.fields.filter(function (field) {
          return field.name != wrapFieldName;
        });

        wrapField.name = wrapFieldName;
        type.fields.push(wrapField);
      });
    });

    return (0, _graphql.buildClientSchema)(schemaData);
  });
}

function fieldpath(typeName, fieldName, types) {
  var fieldNames = fieldName.split(".");
  var type = types.find(function (type) {
    return type.name == typeName;
  });
  var field = type.fields.find(function (field) {
    return field.name == fieldNames[0];
  });

  if (fieldNames.length == 1) {
    return field;
  } else {
    fieldNames.shift();

    if (field.type.ofType) {
      return fieldpath(field.type.ofType.name, fieldNames.join("."), types);
    } else {
      return fieldpath(field.type.name, fieldNames.join("."), types);
    }
  }
}