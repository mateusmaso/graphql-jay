import {buildSchema} from "./buildSchema"
import {deepExtendSchema} from "./deepExtendSchema"
import {wrapData} from "./wrapData"
import {wrapSchema} from "./wrapSchema"
import {unwrapAST} from "./unwrapAST"
import {simplifyAST} from "./simplifyAST"
import {reduceASTs} from "./reduceASTs"
import {fetchData} from "./fetchData"
import {transformAST} from "./transformAST"
import deepAssign from "deep-assign"

export function composeSchema(...services) {
  return Promise.all(services.map((service) => {
    return service()
  })).then((serviceInfos) => {
    return Promise.all(serviceInfos.map((serviceInfo) => {
      var {schema, adapter} = serviceInfo

      if (adapter) {
        return adapter.buildSchema(schema)
      } else {
        return buildSchema(schema)
      }
    })).then((clientSchemas) => {
      return Promise.all(serviceInfos.map((serviceInfo, index) => {
        var {wrapper} = serviceInfo
        var clientSchema = clientSchemas[index]
        return wrapSchema(clientSchema, wrapper)
      })).then((clientSchemasWrapped) => {
        return deepExtendSchema(...clientSchemasWrapped).then((rootClientSchema) => {
          var queryFields = rootClientSchema.getQueryType().getFields()

          Object.keys(queryFields).forEach((queryFieldName) => {
            var queryField = queryFields[queryFieldName]

            queryField.resolve = (parent, args, context, info) => {
              var rootAST = simplifyAST({
                "selectionSet": {
                  "kind": "SelectionSet",
                  "selections": info.fieldASTs
                }
              }, info)

              var asts = serviceInfos.map((serviceInfo, index) => {
                var {schema, adapter} = serviceInfo
                var clientSchema = clientSchemasWrapped[index]

                if (adapter) {
                  return adapter.transformAST(schema, clientSchema, rootAST)
                } else {
                  return transformAST(schema, clientSchema, rootAST)
                }
              })

              reduceASTs(rootAST, ...asts)

              var requests = serviceInfos.map((serviceInfo, index) => {
                var {schema, adapter, url, wrapper, fetch} = serviceInfo
                var clientSchemaWrapped = clientSchemasWrapped[index]
                var clientSchema = clientSchemas[index]
                var ast = unwrapAST(asts[index], clientSchemaWrapped, wrapper)
                var request

                if (adapter) {
                  request = adapter.fetchData(schema, ast, url, fetch)
                } else {
                  request = fetchData(schema, ast, url, fetch)
                }

                return request.then((data) => {
                  return wrapData(data, clientSchema, wrapper)
                })
              })

              return Promise.all(requests).then((responses) => {
                return deepAssign(...responses)
              }).then((response) => {
                return response[info.fieldName]
              })
            }
          })

          return rootClientSchema
        })
      })
    })
  })
}
