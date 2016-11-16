import clone from 'clone'
import keypath from 'keypath'
import traverse from 'traverse'

export function reduceASTs(rootAST, ...asts) {
  var rootFieldPaths = fieldPathsFor(rootAST)

  asts = asts.map((ast) => {
    return clone(ast)
  })

  clone(asts).sort((ast) => {
    return heuristic(rootFieldPaths, ast)
  }).reverse()

  asts.forEach((ast) => {
    var index = asts.indexOf(ast)
    var fieldPaths = fieldPathsFor(ast)

    asts.slice(index + 1).forEach((_ast) => {
      reduceAST(_ast, fieldPaths)
    })
  })

  return asts
}

function deleteFieldPath(ast, fieldPath) {
  var keys = fieldPath.split(".")
  var lastKey = keys[keys.length - 1]
  keys.pop()
  var key = keys.join(".")
  var value = keypath(key, ast)
  delete value[lastKey]
}

function reduceAST(ast, fieldPaths) {
  var objectFieldPaths = []

  fieldPaths.forEach((fieldPath) => {
    var field = keypath(fieldPath, ast)

    if (field) {
      if (Object.keys(field.fields).length > 0) {
        objectFieldPaths.push(fieldPath)
      } else {
        deleteFieldPath(ast, fieldPath)
      }
    }
  })

  objectFieldPaths.reverse().forEach((objectFieldPath) => {
    var field = keypath(objectFieldPath, ast)

    if (Object.keys(field.fields).length == 0) {
      deleteFieldPath(ast, objectFieldPath)
    }
  })
}

function heuristic(rootFieldPaths, ast) {
  var fieldPaths = fieldPathsFor(ast)
  var totalFields = rootFieldPaths.length
  var totalFieldsIncluded = 0
  var totalFieldsExtra = 0

  fieldPaths.forEach((fieldPath) => {
    if (rootFieldPaths.indexOf(fieldPath) >= 0) {
      totalFieldsIncluded++
    } else {
      totalFieldsExtra++
    }
  })

  return ((totalFieldsIncluded/totalFields) * (1 - (0.01 * totalFieldsExtra)))
}

function fieldPathsFor(ast) {
  var fieldPaths = []

  traverse(ast).forEach(function(value) {
    var isFields = this.path[this.path.length - 2] == "fields"

    if (isFields) {
      fieldPaths.push(this.path.join("."))
    }
  })

  return fieldPaths
}
