import clone from 'clone'

export function unwrapAST(ast, schema, wrapper={}) {
  ast = clone(ast)

  var unwrapFields = (type, fields) => {
    var wrap = wrapper[type.name]
    var nextFields = {}

    if (wrap) {
      Object.keys(wrap).forEach((wrapFieldName) => {
        var wrapPath = wrap[wrapFieldName]

        if (fields[wrapFieldName]) {
          var [firstFieldName, secondFieldName] = wrapPath.split(".")

          fields[firstFieldName] = {
            fields: {
              [secondFieldName]: fields[wrapFieldName]
            },
            args: []
          }

          if (firstFieldName != wrapFieldName) {
            delete fields[wrapFieldName]
          } else {
            nextFields[firstFieldName] = fields[firstFieldName].fields[secondFieldName].fields
          }
        }
      })
    }

    Object.keys(fields).forEach((fieldName) => {
      var field = fields[fieldName]

      if (type.getFields && type.getFields()[fieldName]) {
        var typeField = type.getFields()[fieldName]
        unwrapFields(typeField.type.ofType || typeField.type, nextFields[fieldName] || field.fields)
      }
    })
  }

  unwrapFields(schema.getQueryType(), ast.fields)

  return ast
}
