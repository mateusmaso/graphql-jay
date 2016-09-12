var {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLSchema
} = require('graphql');

var store = require('../../store');
var expressGraphQL = require('express-graphql');

var userType = new GraphQLObjectType({
  name: 'User',
  fields: () => {
    return {
      id: {
        type: GraphQLID
      },
      email: {
        type: GraphQLString
      }
    }
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
        resolve: () => {
          return store.user
        }
      }
    }
  })
});

module.exports = expressGraphQL({schema});
