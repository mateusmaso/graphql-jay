import deepAssign from "deep-assign";
import {buildClientSchema} from "graphql";
import {mergeSchema} from "./mergeSchema";
import {simplifyAST} from "./simplifyAST";
import {reduceASTs} from "./reduceASTs";
import {buildRequest} from "./buildRequest";
import {forgeData} from "./forgeData";
import {fetchData} from "./fetchData";
import {transformAST} from "./transformAST";

export function composeSchema(...services) {
  return Promise.all(services.map((service) => {
    return service();
  })).then((services) => {
    var schemas = services.map((service) => {
      var {schema, adapter} = service;

      if (adapter) {
        return adapter.buildClientSchema(schema);
      } else {
        return buildClientSchema(schema);
      }
    });

    return mergeSchema(...schemas).then((rootSchema) => {
      var queryFields = rootSchema.getQueryType().getFields();

      Object.keys(queryFields).forEach((queryFieldName) => {
        var queryField = queryFields[queryFieldName];

        queryField.resolve = (parent, args, context, info) => {
          var rootAST = simplifyAST({
            "selectionSet": {
              "kind": "SelectionSet",
              "selections": info.fieldASTs
            }
          }, info).fields;

          var asts = services.map((service) => {
            var {schema, adapter} = service;

            if (adapter) {
              return adapter.transformAST(schema, rootAST);
            } else {
              return transformAST(schema, rootAST);
            }
          });

          reduceASTs(rootAST, ...asts);

          var requests = services.map((service) => {
            var {schema, adapter, url} = service;
            var index = services.indexOf(service);
            var ast = asts[index];

            if (adapter) {
              return adapter.buildRequest(schema, ast, url);
            } else {
              return buildRequest(schema, ast, url);
            }
          });

          return fetchData(...requests).then((data) => {
            return deepAssign(forgeData(rootSchema, rootAST), data[info.fieldName]);
          });
        }
      });

      return rootSchema;
    });
  });
}
