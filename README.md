# graphql-jay [![Build Status](https://travis-ci.org/mateusmaso/graphql-jay.svg?branch=master)](https://travis-ci.org/mateusmaso/graphql-jay)

This is a GraphQL schema generator for composing resources over data services. It embraces the idea of querying data from multiple APIs within a single and unified schema using the least expensive route available. By doing so, it allows teams to constantly reason, experiment and perform API changes to solve data-flow issues such as response time and size without worrying of breaking clients.

> _APIs should cooperate to provide data to the client in its best way possible._

<img src="http://www.hbw.com/sites/default/files/styles/large_a/public/figures/hbw14/jpg/14_31_026_Cyanocorax%20caeruleus_cerulean.jpg" width=100 />

## Motivations

- Direct API calls are coupling clients to a data service.
- Demand-driven APIs are still struggling to persuade it's investment.
- Yet, there is no future proof API architecture without a trade-off, even GraphQL.
- Monolithic APIs are loosing space with the adoption of microservices.

## Features

- Continuous client-side development.
- Experiment, adopt and compose APIs.
- Remove the concern of reasoning about data-flow.
- Fetch REST APIs using GraphQL data-query language.
- Provide insights on how to improve data-flow.
- Help clients to avoid breaking due to API changes.
- Avoid unecessary data requests. (aka over-fetching)
- Enforce developers to properly document their APIs.

## Install

```
$ npm install --save graphql-jay
```

## Usage

```javascript
import {graphql} from "graphql";
import {composeSchema} from "graphql-jay";
import {v1, v2, graph, graph2} from "./services";

composeSchema(v1, v2, graph, graph2).then((schema) => {
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

### RESTful and Hypermedia APIs

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
