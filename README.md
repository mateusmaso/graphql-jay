# graphql-jay [![Build Status](https://travis-ci.org/mateusmaso/graphql-jay.svg?branch=master)](https://travis-ci.org/mateusmaso/graphql-jay)

This is a GraphQL schema generator for composing data over JSON-based services. It embraces the idea of querying data from multiple APIs within a single and unified schema using the least expensive route available. By doing so, it allows teams to constantly reason, experiment and perform API changes in order to solve data-flow issues such as response time and size without worrying of breaking clients. Plus, you will be able to query web APIs using GraphQL.

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

## License

MIT © [Mateus Maso](http://www.mateusmaso.com)
