"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeSchema = composeSchema;

var _deepAssign = require("deep-assign");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

var _graphql = require("graphql");

var _mergeSchema = require("./mergeSchema");

var _simplifyAST = require("./simplifyAST");

var _reduceASTs = require("./reduceASTs");

var _buildRequest = require("./buildRequest");

var _forgeData = require("./forgeData");

var _fetchData = require("./fetchData");

var _transformAST = require("./transformAST");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function composeSchema() {
  for (var _len = arguments.length, services = Array(_len), _key = 0; _key < _len; _key++) {
    services[_key] = arguments[_key];
  }

  return Promise.all(services.map(function (service) {
    return service();
  })).then(function (services) {
    var schemas = services.map(function (service) {
      var schema = service.schema;
      var adapter = service.adapter;


      if (adapter) {
        return adapter.buildClientSchema(schema);
      } else {
        return (0, _graphql.buildClientSchema)(schema);
      }
    });

    return _mergeSchema.mergeSchema.apply(undefined, _toConsumableArray(schemas)).then(function (rootSchema) {
      var queryFields = rootSchema.getQueryType().getFields();

      Object.keys(queryFields).forEach(function (queryFieldName) {
        var queryField = queryFields[queryFieldName];

        queryField.resolve = function (parent, args, context, info) {
          var rootAST = (0, _simplifyAST.simplifyAST)({
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": info.fieldASTs
            }
          }, info).fields;

          var asts = services.map(function (service) {
            var schema = service.schema;
            var adapter = service.adapter;


            if (adapter) {
              return adapter.transformAST(schema, rootAST);
            } else {
              return (0, _transformAST.transformAST)(schema, rootAST);
            }
          });

          _reduceASTs.reduceASTs.apply(undefined, [rootAST].concat(_toConsumableArray(asts)));

          var requests = services.map(function (service) {
            var schema = service.schema;
            var adapter = service.adapter;
            var url = service.url;

            var index = services.indexOf(service);
            var ast = asts[index];

            if (adapter) {
              return adapter.buildRequest(schema, ast, url);
            } else {
              return (0, _buildRequest.buildRequest)(schema, ast, url);
            }
          });

          return _fetchData.fetchData.apply(undefined, _toConsumableArray(requests)).then(function (data) {
            return (0, _deepAssign2.default)((0, _forgeData.forgeData)(rootSchema, rootAST), data[info.fieldName]);
          });
        };
      });

      return rootSchema;
    });
  });
}