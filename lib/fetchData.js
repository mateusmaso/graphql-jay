'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchData = fetchData;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function fetchData(schema, ast, url, fetchFn) {
  var query = buildQuery(ast);
  var performFetch = fetchFn || _isomorphicFetch2.default;

  if (query) {
    return performFetch(url, {
      body: JSON.stringify({
        query: query
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: "POST"
    }).then(function (response) {
      return response.json();
    }).then(function (response) {
      return response.data;
    });
  } else {
    return Promise.resolve({});
  }
}

function buildQuery(ast) {
  var buildSelection = function buildSelection(fields) {
    var query = "";

    Object.keys(fields).forEach(function (fieldName) {
      var field = fields[fieldName];

      var str = '' + fieldName;

      if (Object.keys(field.args).length > 0) {
        str += "(";

        Object.keys(field.args).forEach(function (argName) {
          if (typeof field.args[argName] == "string") {
            str += argName + ': "' + field.args[argName] + '"';
          } else {
            str += argName + ': ' + field.args[argName];
          }
        });

        str += ")";
      }

      if (Object.keys(field.fields).length > 0) {
        query += str + ' ' + buildSelection(field.fields);
      } else {
        query += str + ' ';
      }

      query = query.replace("  ", " ");
    });

    if (query.trim() != "") {
      return '{ ' + query + ' }';
    }
  };

  return buildSelection(ast.fields);
}