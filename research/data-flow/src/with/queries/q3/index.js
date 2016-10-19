import fetch from "isomorphic-fetch"
import {graphql} from "graphql"
import {composeSchema} from "graphql-jay"
import groupBy from "group-by"

export default function q3(services) {
  return new Promise((resolve) => {
    composeSchema(...services).then((schema) => {
      return graphql(schema, `{
        film(filmID: 1) {
          starships {
            pilots {
              name
            }
          }
          vehicles {
            pilots {
              name
            }
          }
        }
      }`).then((response) => {
        var aNewHope = response.data.film
        var pilots = []

        aNewHope.starships.forEach((starship) => {
          starship.pilots.forEach((pilot) => {
            pilots.push(pilot)
          })
        })

        aNewHope.vehicles.forEach((vehicle) => {
          vehicle.pilots.forEach((pilot) => {
            pilots.push(pilot)
          })
        })

        var pilotsByName = groupBy(pilots, "name")

        var pilotNames = Object.keys(pilotsByName).sort((a, b) => {
          return pilotsByName[a].length > pilotsByName[b].length
        })

        resolve(`Q3: ${pilotNames[0]}`)
      })
    })
  })
}