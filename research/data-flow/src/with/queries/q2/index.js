import fetch from "isomorphic-fetch"
import {graphql} from "graphql"
import groupBy from "group-by"
import {monitorGraphQL} from "../../../perf"

export default function q2(schema) {
  return new Promise((resolve) => {
    return monitorGraphQL(graphql)(schema, `{
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
}
