import keypath from 'keypath';
import traverse from 'traverse';

export function reduceASTs(rootAST, ...asts) {
  var rootFields = fieldsFor(rootAST);

  asts.sort((ast) => {
    return heuristic(rootFields, ast);
  }).reverse();

  asts.forEach((ast) => {
    var index = asts.indexOf(ast);
    var fields = fieldsFor(ast);

    asts.slice(index + 1).forEach((_ast) => {
      reduceAST(_ast, fields);
    });
  });
}

function reduceAST(ast, fields) {
  fields.forEach((field) => {
    if (keypath(field, ast)) {
      var _ = field.split(".");
      var lastKey = _[_.length - 1];
      _.pop();
      var key = _.join(".")
      var obj = keypath(key, ast);
      delete obj[lastKey];
    }
  });
}

function heuristic(rootFields, ast) {
  var fields = fieldsFor(ast);
  var totalFields = rootFields.length;
  var totalFieldsIncluded = 0;
  var totalFieldsExtra = 0;

  fields.forEach((field) => {
    if (rootFields.indexOf(field) >= 0) {
      totalFieldsIncluded++;
    } else {
      totalFieldsExtra++;
    }
  });

  return ((totalFieldsIncluded/totalFields) * (1 - (0.01 * totalFieldsExtra)));
}

function fieldsFor(ast) {
  var fields = [];

  traverse(ast).forEach(function(value) {
    var isFields = this.path[this.path.length - 2] == "fields";

    if (isFields) {
      fields.push(this.path.join("."));
    }
  });

  return fields;
}
