"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.composeSchema = composeSchema;

var _buildSchema = require("./buildSchema");

var _deepExtendSchema = require("./deepExtendSchema");

var _deepExtendData = require("./deepExtendData");

var _wrapData = require("./wrapData");

var _wrapSchema = require("./wrapSchema");

var _unwrapAST = require("./unwrapAST");

var _simplifyAST = require("./simplifyAST");

var _reduceASTs = require("./reduceASTs");

var _fetchData = require("./fetchData");

var _transformAST = require("./transformAST");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function composeSchema() {
  for (var _len = arguments.length, services = Array(_len), _key = 0; _key < _len; _key++) {
    services[_key] = arguments[_key];
  }

  return Promise.all(services.map(function (service) {
    return service();
  })).then(function (services) {
    return Promise.all(services.map(function (service) {
      var schema = service.schema;
      var adapter = service.adapter;


      if (adapter) {
        return adapter.buildSchema(schema);
      } else {
        return (0, _buildSchema.buildSchema)(schema);
      }
    })).then(function (schemas) {
      return Promise.all(services.map(function (service, index) {
        var wrapper = service.wrapper;

        var schema = schemas[index];
        return (0, _wrapSchema.wrapSchema)(schema, wrapper);
      })).then(function (wrappedSchemas) {
        return _deepExtendSchema.deepExtendSchema.apply(undefined, _toConsumableArray(wrappedSchemas)).then(function (rootSchema) {
          var queryFields = rootSchema.getQueryType().getFields();

          Object.keys(queryFields).forEach(function (queryFieldName) {
            var queryField = queryFields[queryFieldName];

            queryField.resolve = function (parent, args, context, info) {
              var rootAST = (0, _simplifyAST.simplifyAST)({
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": info.fieldASTs
                }
              }, info);

              var asts = services.map(function (service, index) {
                var metadata = service.metadata;
                var adapter = service.adapter;

                var schema = wrappedSchemas[index];

                if (adapter) {
                  return adapter.transformAST(metadata, schema, rootAST);
                } else {
                  return (0, _transformAST.transformAST)(metadata, schema, rootAST);
                }
              });

              asts = _reduceASTs.reduceASTs.apply(undefined, [rootAST].concat(_toConsumableArray(asts)));

              var requests = services.map(function (service, index) {
                var metadata = service.metadata;
                var adapter = service.adapter;
                var url = service.url;
                var wrapper = service.wrapper;
                var fetch = service.fetch;

                var wrappedSchema = wrappedSchemas[index];
                var schema = schemas[index];
                var ast = (0, _unwrapAST.unwrapAST)(asts[index], wrappedSchema, wrapper);
                var request;

                if (adapter) {
                  request = adapter.fetchData(metadata, ast, url, fetch);
                } else {
                  request = (0, _fetchData.fetchData)(metadata, ast, url, fetch);
                }

                return request.then(function (data) {
                  return (0, _wrapData.wrapData)(data, schema, wrapper);
                });
              });

              return Promise.all(requests).then(function (responses) {
                return _deepExtendData.deepExtendData.apply(undefined, _toConsumableArray(responses));
              }).then(function (response) {
                return response[info.fieldName];
              });
            };
          });

          return rootSchema;
        });
      });
    });
  });
}