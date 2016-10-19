import fetch from "isomorphic-fetch"
import {graphql} from "graphql"
import {composeSchema} from "graphql-jay"
import groupBy from "group-by"

export default function q2(services) {
  return new Promise((resolve) => {
    composeSchema(...services).then((schema) => {
      return graphql(schema, `{
        planet(planetID: 1) {
          residents {
            species {
              name
            }
          }
        }
      }`).then((response) => {
        var tatooine = response.data.planet

        var residentsBySpecies = groupBy(tatooine.residents, (resident) => {
          var name

          resident.species.forEach((specie) => {
            if (name) {
              name = `${name} & ${specie.name}`
            } else {
              name = specie.name
            }
          })

          return name || "Unknown"
        })

        var specieNames = Object.keys(residentsBySpecies).sort((a, b) => {
          return residentsBySpecies[a].length > residentsBySpecies[b].length
        })

        resolve(`Q2: ${specieNames[0]}`)
      })
    })
  })
}
