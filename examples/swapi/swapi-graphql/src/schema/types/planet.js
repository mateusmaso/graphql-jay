/* @flow */
/**
 *  Copyright (c) 2015, Facebook, Inc.
 *  All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE-examples file in the root directory of this source tree.
 */

import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import {
  globalIdField
} from 'graphql-relay';

import { nodeInterface } from '../relayNode';
import { createdField, editedField } from '../commonFields';
import { connectionFromUrls } from '../connections';

import FilmType from './film';
import PersonType from './person';

/**
 * The GraphQL type equivalent of the Planet resource
 */
var PlanetType = new GraphQLObjectType({
  name: 'Planet',
  description:
`A large mass, planet or planetoid in the Star Wars Universe, at the time of
0 ABY.`,
  fields: () => ({
    name: {
      type: GraphQLString,
      description:
`The name of this planet.`
    },
    diameter: {
      type: GraphQLString,
      description:
`The diameter of this planet in kilometers.`
    },
    rotationPeriod: {
      type: GraphQLString,
      resolve: (planet) => planet.rotation_period,
      description:
`The number of standard hours it takes for this planet to complete a single
rotation on its axis.`
    },
    orbitalPeriod: {
      type: GraphQLString,
      resolve: (planet) => planet.orbital_period,
      description:
`The number of standard days it takes for this planet to complete a single orbit
of its local star.`
    },
    gravity: {
      type: GraphQLString,
      description:
`A number denoting the gravity of this planet, where "1" is normal or 1 standard
G. "2" is twice or 2 standard Gs. "0.5" is half or 0.5 standard Gs.`
    },
    population: {
      type: GraphQLString,
      description:
`The average population of sentient beings inhabiting this planet.`
    },
    climate: {
      type: GraphQLString,
      description:
`The climates of this planet.`
    },
    terrain: {
      type: GraphQLString,
      description:
`The terrains of this planet.`
    },
    surfaceWater: {
      type: GraphQLString,
      resolve: (planet) => planet.surface_water,
      description:
`The percentage of the planet surface that is naturally occuring water or bodies
of water.`
    },
    residentConnection: connectionFromUrls(
      'PlanetResidents',
      'residents',
      PersonType
    ),
    filmConnection: connectionFromUrls(
      'PlanetFilms',
      'films',
      FilmType
    ),
    created: createdField(),
    edited: editedField(),
    id: globalIdField('planets')
  }),
  interfaces: () => [nodeInterface],
});
export default PlanetType;
