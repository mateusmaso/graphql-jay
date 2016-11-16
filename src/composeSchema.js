import {buildSchema} from "./buildSchema"
import {deepExtendSchema} from "./deepExtendSchema"
import {deepExtendData} from "./deepExtendData"
import {wrapData} from "./wrapData"
import {wrapSchema} from "./wrapSchema"
import {unwrapAST} from "./unwrapAST"
import {simplifyAST} from "./simplifyAST"
import {reduceASTs} from "./reduceASTs"
import {fetchData} from "./fetchData"
import {transformAST} from "./transformAST"

export function composeSchema(...services) {
  return Promise.all(services.map((service) => {
    return service()
  })).then((services) => {
    return Promise.all(services.map((service) => {
      var {schema, adapter} = service

      if (adapter) {
        return adapter.buildSchema(schema)
      } else {
        return buildSchema(schema)
      }
    })).then((schemas) => {
      return Promise.all(services.map((service, index) => {
        var {wrapper} = service
        var schema = schemas[index]
        return wrapSchema(schema, wrapper)
      })).then((wrappedSchemas) => {
        return deepExtendSchema(...wrappedSchemas).then((rootSchema) => {
          var queryFields = rootSchema.getQueryType().getFields()

          Object.keys(queryFields).forEach((queryFieldName) => {
            var queryField = queryFields[queryFieldName]

            queryField.resolve = (parent, args, context, info) => {
              var rootAST = simplifyAST({
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": info.fieldASTs
                }
              }, info)

              var asts = services.map((service, index) => {
                var {metadata, adapter} = service
                var schema = wrappedSchemas[index]

                if (adapter) {
                  return adapter.transformAST(metadata, schema, rootAST)
                } else {
                  return transformAST(metadata, schema, rootAST)
                }
              })

              asts = reduceASTs(rootAST, ...asts)

              var requests = services.map((service, index) => {
                var {metadata, adapter, url, wrapper, fetch} = service
                var wrappedSchema = wrappedSchemas[index]
                var schema = schemas[index]
                var ast = unwrapAST(asts[index], wrappedSchema, wrapper)
                var request

                if (adapter) {
                  request = adapter.fetchData(metadata, ast, url, fetch)
                } else {
                  request = fetchData(metadata, ast, url, fetch)
                }

                return request.then((data) => {
                  return wrapData(data, schema, wrapper)
                })
              })

              return Promise.all(requests).then((responses) => {
                return deepExtendData(...responses)
              }).then((response) => {
                return response[info.fieldName]
              })
            }
          })

          return rootSchema
        })
      })
    })
  })
}
