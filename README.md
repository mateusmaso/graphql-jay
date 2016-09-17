# graphql-jay [![Build Status](https://travis-ci.org/mateusmaso/graphql-jay.svg?branch=master)](https://travis-ci.org/mateusmaso/graphql-jay)

This is a GraphQL schema generator for composing objects over JSON-based services. It embraces the idea of querying data from multiple APIs within a single and unified schema using the least expensive route available. By doing so, it allows teams to constantly reason, experiment and perform semantic API changes to solve data-flow issues such as response time and size without worrying of breaking clients.

> _Web APIs should cooperate to provide JSON data to the client in its best way possible._

<img src="http://www.hbw.com/sites/default/files/styles/large_a/public/figures/hbw14/jpg/14_31_026_Cyanocorax%20caeruleus_cerulean.jpg" width=100 />

## Motivations

- Direct API calls are coupling clients to services.
- GraphQL adoption still low because it's hard to justify the additional investment.
- Fetching data from microservices APIs should be as easy as fetching data from a monolithic API.

## Why should I use?

- Fetch resources from REST API using GraphQL.
- Continuous client-side development.
- Experiment, adopt and compose APIs.
- Remove concern of data-flow reasoning.
- Provide insights on client-server communication.
- Prevent clients of breaking due to semantic API changes.
- Avoid unecessary data requests such as over-fetching.
- Enforce developers to properly document their APIs. (human & machine readable)

## Install

```
$ npm install --save graphql-jay
```

## Usage

```javascript
import {graphql} from "graphql";
import {composeSchema} from "graphql-jay";
import {v1, v2, graph, graph2, rpc, rpc2} from "./services";

composeSchema(v1, v2, graph, graph2, rpc, rpc2).then((schema) => {
  graphql(schema, `{
    user(id: 1) {
      id
      name
      posts {
        id
        creator {
          id
          email
          image {
            small
          }
        }
      }
    }
  }`).then((response) => {
    // GET api/v1/users/1
    // GET api/v2/users/1/posts
    // GET api/graph?query=user(id:1){email}
    // GET api/graph-2?query=user(id:1){image{small}}
    // GET api/rpc?jsonrpc=2.0&method=getUser&id=1
    // GET api/rpc2?jsonrpc=2.0&method=findUser&id=1
    var {user} = response;
  });
});
```

## Defining services

### GraphQL APIs

```javascript
import {introspectionQuery} from "graphql";

export default function myService() {
  var schema = {
    "__schema": {
      "queryType": {
        "name": "Query"
      },
      "types": [...]
    }
  };

  // or fetch schema remotely
  // var body = JSON.stringify({query: introspectionQuery};
  // return fetch(url, {body}).then(...)

  return {
    schema
  }
};
```

### REST APIs and JSON-RPC

```javascript
import {hyperSchemaAdapter} from "graphql-jay-hyperschema";

export default function myService() {  
  var schema = {
    "$schema": "http://json-schema.org/draft-04/hyper-schema#",
    "type": "object",
    "definitions": {
      "user": {
        "type": "object",
        "properties": {...},
        "required": [...],
        "links": [...]
      }
    },
    "properties": {
      "user": {
        "$ref": "#/definitions/user"
      }
    }
  }

  // or fetch schema remotely
  // return fetch(url).then(...)

  return {
    schema,
    adapter: hyperSchemaAdapter
  }
};
```

## License

MIT © [Mateus Maso](http://www.mateusmaso.com)
