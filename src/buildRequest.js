import {buildClientSchema} from "graphql";

export function buildRequest(schema, ast, url) {
  schema = buildClientSchema(schema);

  return [{
    href: `${url}?query=${buildQuery(ast)}`,
    next: []
  }];
}

function buildQuery(ast) {
  var buildSelection = (fields) => {
    var query = "";

    Object.keys(fields).forEach((fieldName) => {
      var field = fields[fieldName];

      var str = `${fieldName}`;

      if (Object.keys(field.args).length > 0) {
        str += "("

        Object.keys(field.args).forEach((argName) => {
          str += `${argName}: ${field.args[argName]}`
        });

        str += ")"
      }

      if (Object.keys(field.fields).length > 0) {
        query += `${str} ${buildSelection(field.fields)}`
      } else {
        query += `${str} `;
      }

      query = query.replace("  ", " ");
    });

    return `{ ${query} }`;
  };

  return buildSelection(ast);
}
