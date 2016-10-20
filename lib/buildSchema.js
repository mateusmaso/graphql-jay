"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.buildSchema = buildSchema;

var _graphql = require("graphql");

function buildSchema(schema) {
  return (0, _graphql.buildClientSchema)(schema);
}