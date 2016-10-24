# Data Flow Research

Comparative research on GraphQLJay's usage as a decoupling tool for client-server due to data flow changes.

## Data Structure

- Film, People, Species, Planet, Starship, Vehicle (SWAPI)

## Queries (Client)

- What's the name of the movie which has the most characters from a desert homeworld?
- What's the name of the predominant species among "Tatooine" planet residents?
- What's the name of the character that drive most starships and vehicles during the movie "A New Hope".

## Data Flow Changes (Server)

- Realocation
  - Change endpoint URI.
  - Change response structure level.
  - Add faster endpoint.
  - Remove deprecated endpoint.
- Transition
  - Change version.
  - Change architecture style.
- Composition
  - Change to microservices.

## Variables

- Answer rate (%)
- Response size (kb)
- Request count (integer)
- Metadata fetching time (ms)
- Processing time (ms)
