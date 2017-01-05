import clone from "clone"
import {graphql, introspectionQuery, buildClientSchema} from 'graphql'

export function wrapSchema(schema, wrapper={}) {
  return graphql(schema, introspectionQuery).then((response) => {
    var schemaData = response.data
    var types = schemaData.__schema.types

    Object.keys(wrapper).forEach((typeName) => {
      var wrap = wrapper[typeName]
      var type = types.find((type) => {
        return type.name == typeName
      })

      Object.keys(wrap).forEach((wrapFieldName) => {
        var fieldName = wrap[wrapFieldName]
        var wrapField = clone(fieldpath(type.name, fieldName, types))

        type.fields = type.fields.filter((field) => {
          return field.name != wrapFieldName
        })

        wrapField.name = wrapFieldName
        type.fields.push(wrapField)
      })
    })

    return buildClientSchema(schemaData)
  })
}

function fieldpath(typeName, fieldName, types) {
  var fieldNames = fieldName.split(".")
  var type = types.find((type) => {
    return type.name == typeName
  })
  var field = type.fields.find((field) => {
    return field.name == fieldNames[0]
  })

  if (fieldNames.length == 1) {
    return field
  } else {
    fieldNames.shift()

    if (field.type.ofType) {
      return fieldpath(field.type.ofType.name, fieldNames.join("."), types)
    } else {
      return fieldpath(field.type.name, fieldNames.join("."), types)
    }
  }
}
