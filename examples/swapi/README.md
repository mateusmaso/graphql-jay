# SWAPI

Comparative research on GraphQL Jay's usage as a decoupling tool for client-server communication.

## Install

```
$ npm install && cd swapi-graphql && npm install && cd ..
```

## Run

```
$ npm start && sleep .2 && cat data.json
```

## Entities

- Film, People, Species, Planet, Starship, Vehicle

## Questions

- What's the name of the movie which has the most characters from a desert homeworld?
- What's the name of the predominant species among "Tatooine" planet residents?
- What's the name of the character that drive most starships and vehicles during the movie "A New Hope"?

## Data Flow Changes

- [Change endpoint URI](https://github.com/mateusmaso/graphql-jay/tree/dfr-01).
- [Change response structure level](https://github.com/mateusmaso/graphql-jay/tree/dfr-02).
- [Add faster endpoint](https://github.com/mateusmaso/graphql-jay/tree/dfr-03).
- [Remove deprecated endpoint](https://github.com/mateusmaso/graphql-jay/tree/dfr-04).

## Variables

- Answer rate (%)
- Response size (kb)
- Request count (integer)
- Metadata fetching time (ms)
- Processing time (ms)
