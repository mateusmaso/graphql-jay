"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildRequest = buildRequest;

var _graphql = require("graphql");

function buildRequest(schema, ast, url) {
  schema = (0, _graphql.buildClientSchema)(schema);

  return [{
    href: url + "?query=" + buildQuery(ast),
    next: []
  }];
}

function buildQuery(ast) {
  var buildSelection = function buildSelection(fields) {
    var query = "";

    Object.keys(fields).forEach(function (fieldName) {
      var field = fields[fieldName];

      var str = "" + fieldName;

      if (Object.keys(field.args).length > 0) {
        str += "(";

        Object.keys(field.args).forEach(function (argName) {
          str += argName + ": " + field.args[argName];
        });

        str += ")";
      }

      if (Object.keys(field.fields).length > 0) {
        query += str + " " + buildSelection(field.fields);
      } else {
        query += str + " ";
      }

      query = query.replace("  ", " ");
    });

    return "{ " + query + " }";
  };

  return buildSelection(ast);
}