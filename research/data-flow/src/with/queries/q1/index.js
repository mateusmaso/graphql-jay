import fetch from "isomorphic-fetch"
import {graphql} from "graphql"
import {composeSchema} from "graphql-jay"
import perf from "../../../perf"

export default function q1(services) {
  perf.schemaCreation()
  return new Promise((resolve) => {
    composeSchema(...services).then((schema) => {
      perf.schemaCreationEnd()
      perf.schemaFetching()

      graphql(schema, `{
        allFilms {
          title
          characters {
            homeworld {
              climate
            }
          }
        }
      }`).then((response) => {
        perf.schemaFetchingEnd()

        var films = response.data.allFilms
        var filmWithDesertCharacters = films.map((film) => {
          var count = 0

          film.characters.forEach((character) => {
            if (character.homeworld.climate.indexOf("arid") >= 0) {
              count++
            }
          })

          return {
            film,
            count
          }
        })

        filmWithDesertCharacters.sort((a, b) => {
          return a.count < b.count
        })

        resolve(`Q1: ${filmWithDesertCharacters[0].film.title}`)
      })
    })
  })
}
