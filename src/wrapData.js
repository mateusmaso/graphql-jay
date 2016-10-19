export function wrapData(data, schema, wrapper={}) {
  var wrapFields = (type, fields) => {
    var wrap = wrapper[type.name]

    if (wrap) {
      Object.keys(wrap).forEach((wrapFieldName) => {
        var wrapPath = wrap[wrapFieldName]
        var [firstFieldName, secondFieldName] = wrapPath.split(".")

        var fieldsList = [fields];

        if (Array.isArray(fields)) {
          fieldsList = fields;
        }

        fieldsList.forEach((fields) => {
          if (fields[firstFieldName] && fields[firstFieldName][secondFieldName]) {
            fields[wrapFieldName] = fields[firstFieldName][secondFieldName]

            if (wrapFieldName != firstFieldName) {
              delete fields[firstFieldName]
            }

            var typeField = type.getFields()[firstFieldName].type.getFields()[secondFieldName]

            if (typeof fields[wrapFieldName] == "object") {
              wrapFields(typeField.type.ofType || typeField.type, fields[wrapFieldName])
            }
          }
        })
      })
    }

    Object.keys(fields).forEach((fieldName) => {
      var field = fields[fieldName]

      if (type.getFields && type.getFields()[fieldName]) {
        var typeField = type.getFields()[fieldName]
        wrapFields(typeField.type.ofType || typeField.type, field)
      }
    })
  }

  wrapFields(schema.getQueryType(), data)

  return data
}
