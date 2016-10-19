# Data Flow Research

Comparative research on GraphQLJay's usage as a decoupling tool for client-server due to data flow changes.

## Entities (Data Structure)

- Film, People, Species, Planet, Starship, Vehicle (SWAPI)

## Client Queries

- What's the name of the movie which has the most characters from a desert homeworld?
- What's the name of the predominant species among "Tatooine" planet residents?
- What's the name of the character that drive most starships and vehicles during the movie "A New Hope".

## Server Changes (Data Flow)

- Realocation
  - A REST endpoint (in usage) has been renamed.
    - Expect: Keep using the same endpoint.
  - A REST endpoint (in usage) has been changed or removed
    - Expect: Find alternate endpoint to complement missing data.
  - A faster REST endpoint has been added
    - Expect: Use faster way to access data.
- Transition
  - Versioning (REST V1 to REST V2)
    - Expect: Smooth transition
  - Architecture Style (REST to GraphQL)
    - Expect: Use GraphQL whenever possible to avoid over-fetching
- Composition
  - Microservices (GraphQL Service + REST Service)
    - Expect: Combine data from both services

## Variables

- Client code size before change (# of characters)
- Response time before change (ms)
- Response size before change (kb)
- Requests before change (# of calls)
- Processing time (ms)
- Could fetch data after change? (Y/N)
- Client code size after change (# of characters)
- Response time after change (ms)
- Response size after change (kb)
- Requests after change (# of calls)
- Client code diff after fix (++ & --)
