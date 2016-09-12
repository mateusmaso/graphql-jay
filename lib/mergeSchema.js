'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mergeSchema = mergeSchema;

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _graphql = require('graphql');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function mergeSchema() {
  for (var _len = arguments.length, schemas = Array(_len), _key = 0; _key < _len; _key++) {
    schemas[_key] = arguments[_key];
  }

  return Promise.all(schemas.map(function (schema) {
    return (0, _graphql.graphql)(schema, _graphql.introspectionQuery).then(function (response) {
      return response.data;
    });
  })).then(function (schemasData) {
    var rootSchemaData = {
      "__schema": {
        "queryType": {
          "name": "Query"
        },
        "types": []
      }
    };

    schemasData.forEach(function (schemaData) {
      schemaData = (0, _clone2.default)(schemaData);
      schemaData.__schema.types.forEach(function (type) {
        var rootType = rootSchemaData.__schema.types.find(function (rootType) {
          return rootType.name == type.name;
        });

        if (rootType) {
          extendType(rootType, type);
        } else {
          rootSchemaData.__schema.types.push(type);
        }
      });
    });

    return (0, _graphql.buildClientSchema)(rootSchemaData);
  });
}

function extendType(rootType, type) {
  (type.fields || []).forEach(function (field) {
    var rootField = rootType.fields.find(function (rootField) {
      return rootField.name == field.name;
    });

    if (rootField) {
      extendTypeField(rootField, field);
    } else {
      rootType.fields.push(field);
    }
  });
}

function extendTypeField(rootField, field) {
  (field.args || []).forEach(function (arg) {
    var rootArg = rootField.args.find(function (rootArg) {
      return rootArg.name == arg.name;
    });

    if (rootArg) {
      Object.assign(rootArg, arg);
    } else {
      rootField.args.push(arg);
    }
  });
}