import clone from 'clone'
import {graphql, introspectionQuery, buildClientSchema} from 'graphql'

export function deepExtendSchema(...schemas) {
  return Promise.all(schemas.map((schema) => {
    return graphql(schema, introspectionQuery).then((response) => {
      return response.data
    })
  })).then((schemasData) => {
    var rootSchemaData = {
      "__schema": {
        "queryType": {
          "name": "GraphQLJayQueryType"
        },
        "types": []
      }
    }

    schemasData.forEach((schemaData) => {
      schemaData = clone(schemaData)

      var queryTypeName = schemaData.__schema.queryType.name
      schemaData.__schema.queryType.name = "GraphQLJayQueryType"

      schemaData.__schema.types.forEach((type) => {
        if (type.name == queryTypeName) {
          type.name = "GraphQLJayQueryType"
        }

        var rootType = rootSchemaData.__schema.types.find((rootType) => {
          return rootType.name == type.name
        })

        if (rootType) {
          extendType(rootType, type)
        } else {
          rootSchemaData.__schema.types.push(type)
        }
      })
    })

    return buildClientSchema(rootSchemaData)
  })
}

function extendType(rootType, type) {
  var fields = type.fields || []

  fields.forEach((field) => {
    var rootField = rootType.fields.find((rootField) => {
      return rootField.name == field.name
    })

    if (rootField) {
      extendTypeField(rootField, field)
    } else {
      rootType.fields.push(field)
    }
  })
}

function extendTypeField(rootField, field) {
  var args = field.args || []

  args.forEach((arg) => {
    var rootArg = rootField.args.find((rootArg) => {
      return rootArg.name == arg.name
    })

    if (rootArg) {
      Object.assign(rootArg, arg)
    } else {
      rootField.args.push(arg)
    }
  })
}
