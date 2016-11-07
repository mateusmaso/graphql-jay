import fetch from "isomorphic-fetch"

export function fetchData(metadata, ast, url, fetchFn) {
  var query = buildQuery(ast)
  var performFetch = fetchFn || fetch

  if (query) {
    return performFetch(url, {
      body: JSON.stringify({
        query
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST"
    }).then((response) => {
      return response.json()
    }).then((response) => {
      return response.data
    })
  } else {
    return Promise.resolve({})
  }
}

function buildQuery(ast) {
  var buildSelection = (fields) => {
    var query = ""

    Object.keys(fields).forEach((fieldName) => {
      var field = fields[fieldName]

      var str = `${fieldName}`

      if (Object.keys(field.args).length > 0) {
        str += "("

        Object.keys(field.args).forEach((argName) => {
          if (typeof field.args[argName] == "string") {
            str += `${argName}: "${field.args[argName]}"`
          } else {
            str += `${argName}: ${field.args[argName]}`
          }
        })

        str += ")"
      }

      if (Object.keys(field.fields).length > 0) {
        query += `${str} ${buildSelection(field.fields)}`
      } else {
        query += `${str} `
      }

      query = query.replace("  ", " ")
    })

    if (query.trim() != "") {
      return `{ ${query} }`
    }
  }

  return buildSelection(ast.fields)
}
