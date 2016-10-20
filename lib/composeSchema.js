"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeSchema = composeSchema;

var _buildSchema = require("./buildSchema");

var _deepExtendSchema = require("./deepExtendSchema");

var _wrapData = require("./wrapData");

var _wrapSchema = require("./wrapSchema");

var _unwrapAST = require("./unwrapAST");

var _simplifyAST = require("./simplifyAST");

var _reduceASTs = require("./reduceASTs");

var _fetchData = require("./fetchData");

var _transformAST = require("./transformAST");

var _deepAssign = require("deep-assign");

var _deepAssign2 = _interopRequireDefault(_deepAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function composeSchema() {
  for (var _len = arguments.length, services = Array(_len), _key = 0; _key < _len; _key++) {
    services[_key] = arguments[_key];
  }

  return Promise.all(services.map(function (service) {
    return service();
  })).then(function (serviceInfos) {
    return Promise.all(serviceInfos.map(function (serviceInfo) {
      var schema = serviceInfo.schema;
      var adapter = serviceInfo.adapter;


      if (adapter) {
        return adapter.buildSchema(schema);
      } else {
        return (0, _buildSchema.buildSchema)(schema);
      }
    })).then(function (clientSchemas) {
      return Promise.all(serviceInfos.map(function (serviceInfo, index) {
        var wrapper = serviceInfo.wrapper;

        var clientSchema = clientSchemas[index];
        return (0, _wrapSchema.wrapSchema)(clientSchema, wrapper);
      })).then(function (clientSchemasWrapped) {
        return _deepExtendSchema.deepExtendSchema.apply(undefined, _toConsumableArray(clientSchemasWrapped)).then(function (rootClientSchema) {
          var queryFields = rootClientSchema.getQueryType().getFields();

          Object.keys(queryFields).forEach(function (queryFieldName) {
            var queryField = queryFields[queryFieldName];

            queryField.resolve = function (parent, args, context, info) {
              var rootAST = (0, _simplifyAST.simplifyAST)({
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": info.fieldASTs
                }
              }, info);

              var asts = serviceInfos.map(function (serviceInfo, index) {
                var schema = serviceInfo.schema;
                var adapter = serviceInfo.adapter;

                var clientSchema = clientSchemasWrapped[index];

                if (adapter) {
                  return adapter.transformAST(schema, clientSchema, rootAST);
                } else {
                  return (0, _transformAST.transformAST)(schema, clientSchema, rootAST);
                }
              });

              _reduceASTs.reduceASTs.apply(undefined, [rootAST].concat(_toConsumableArray(asts)));

              var requests = serviceInfos.map(function (serviceInfo, index) {
                var schema = serviceInfo.schema;
                var adapter = serviceInfo.adapter;
                var url = serviceInfo.url;
                var wrapper = serviceInfo.wrapper;
                var fetch = serviceInfo.fetch;

                var clientSchemaWrapped = clientSchemasWrapped[index];
                var clientSchema = clientSchemas[index];
                var ast = (0, _unwrapAST.unwrapAST)(asts[index], clientSchemaWrapped, wrapper);
                var request;

                if (adapter) {
                  request = adapter.fetchData(schema, ast, url, fetch);
                } else {
                  request = (0, _fetchData.fetchData)(schema, ast, url, fetch);
                }

                return request.then(function (data) {
                  return (0, _wrapData.wrapData)(data, clientSchema, wrapper);
                });
              });

              return Promise.all(requests).then(function (responses) {
                return _deepAssign2.default.apply(undefined, _toConsumableArray(responses));
              }).then(function (response) {
                return response[info.fieldName];
              });
            };
          });

          return rootClientSchema;
        });
      });
    });
  });
}