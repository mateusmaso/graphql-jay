'use strict';

var _require = require('graphql');

var GraphQLID = _require.GraphQLID;
var GraphQLInt = _require.GraphQLInt;
var GraphQLObjectType = _require.GraphQLObjectType;
var GraphQLSchema = _require.GraphQLSchema;


var store = require('../../store');
var expressGraphQL = require('express-graphql');

var userType = new GraphQLObjectType({
  name: 'User',
  fields: function fields() {
    return {
      id: {
        type: GraphQLID
      },
      age: {
        type: GraphQLInt
      }
    };
  }
});

var schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'Query',
    fields: {
      user: {
        type: userType,
        args: {
          id: {
            type: GraphQLID
          }
        },
        resolve: function resolve() {
          return store.user;
        }
      }
    }
  })
});

module.exports = expressGraphQL({ schema: schema });