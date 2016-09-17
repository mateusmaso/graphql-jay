'use strict';

var _require = require('graphql');

var GraphQLID = _require.GraphQLID;
var GraphQLString = _require.GraphQLString;
var GraphQLObjectType = _require.GraphQLObjectType;
var GraphQLList = _require.GraphQLList;
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
      name: {
        type: GraphQLString
      },
      image: {
        type: userImageType
      }
    };
  }
});

var userImageType = new GraphQLObjectType({
  name: 'UserImage',
  fields: function fields() {
    return {
      small: {
        type: GraphQLString
      },
      large: {
        type: GraphQLString
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