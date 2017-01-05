# graphql-jay [![Build Status](https://travis-ci.org/mateusmaso/graphql-jay.svg?branch=master)](https://travis-ci.org/mateusmaso/graphql-jay)

This is a GraphQL schema generator for composing Web APIs. It embraces the idea of querying data from multiple services (GraphQL API, REST API, JSON-RPC API, etc) within a single and unified GraphQL schema using the least expensive route available. By automating the data fetching process, it allows teams to constantly reason, experiment and perform changes on the API specification without versioning in order to solve data-flow problems.

<img src="http://www.hbw.com/sites/default/files/styles/large_a/public/figures/hbw14/jpg/14_31_026_Cyanocorax%20caeruleus_cerulean.jpg" width=100 />

## Install

```
$ npm install --save graphql-jay
```

## Usage

```javascript
import {graphql} from "graphql"
import {composeSchema} from "graphql-jay"
import {v1, rpc, graph} from "./services"

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
    var {user} = response.data
  })
})
```

## Defining Services

### GraphQL API

```javascript
import fetch from "isomorphic-fetch"
import {introspectionQuery} from "graphql"

var url = "http://myservice.com/graphql"

export default function service() {
  return fetch(url, {
    body: JSON.stringify({
      query: introspectionQuery,
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then((response) => {
    return response.json()
  }).then((response) => {
    var wrapper = {
      User: {
        "imageUrl": "image.small"
      }
    }

    return {
      url,
      schema: response.data,
      wrapper
    }
  })
}
```

### REST API

- [JSON Hyper-Schema](https://www.github.com/mateusmaso/graphql-jay-hyperschema)
- RAML
- API Blueprint
- Swagger

## Examples

#### [SWAPI](https://www.github.com/mateusmaso/graphql-jay/tree/master/research/todomvc)

## License

MIT © [Mateus Maso](http://www.mateusmaso.com)
