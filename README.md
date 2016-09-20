# graphql-jay [![Build Status](https://travis-ci.org/mateusmaso/graphql-jay.svg?branch=master)](https://travis-ci.org/mateusmaso/graphql-jay)

This is a GraphQL schema generator for composing data over JSON-based services. It embraces the idea of querying data from multiple APIs within a single and unified schema using the least expensive route available. By doing so, it allows teams to constantly reason, experiment and perform API changes in order to solve data-flow issues such as response time and size without worrying of breaking clients.

<img src="http://www.hbw.com/sites/default/files/styles/large_a/public/figures/hbw14/jpg/14_31_026_Cyanocorax%20caeruleus_cerulean.jpg" width=100 />

## Motivations

- Direct API calls are coupling clients to data services.
- Developers are being discouraged from performing API changes.
- Services should cooperate to provide data to clients in a "monolithic" API way.

## Why should I use?

- Fetch REST resources using GraphQL.
- Remove concern of reasoning about data-flow.
- Experiment, adopt and compose multiple API styles.
- Provide insights on client-server communication.
- Prevent clients of breaking due to data access changes.
- Avoid unecessary data requests such as over-fetching.
- Enforce developers to properly document their APIs.
- Promote continuous client-side development.

## Install

```
$ npm install --save graphql-jay
```

## Usage

```javascript
import {graphql} from "graphql";
import {composeSchema} from "graphql-jay";
import {v1, rpc, graph} from "./services";

composeSchema(v1, rpc, graph).then((schema) => {
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
    // GET api/rpc?jsonrpc=2.0&method=getUser&id=1
    // GET api/graph?query=user(id:1){image{small}}
    var {user} = response;
  });
});
```

## Defining services

### GraphQL API style

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

### REST API style

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

### JSON-RPC API style

TODO

## License

MIT © [Mateus Maso](http://www.mateusmaso.com)
