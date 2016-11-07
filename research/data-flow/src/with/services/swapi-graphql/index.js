import fetch from "isomorphic-fetch"
import {introspectionQuery} from "graphql"
import {monitorFetch} from "../../../perf"

var url = "http://localhost:8080"

export default function swapiGraphQL() {
  return monitorFetch(fetch)(url, {
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
      Root: {
        "allFilms": "allFilms.films"
      },
      Film: {
        "characters": "characterConnection.characters",
        "starships": "starshipConnection.starships",
        "vehicles": "vehicleConnection.vehicles"
      },
      Planet: {
        "residents": "residentConnection.residents",
      },
      Vehicle: {
        "pilots": "pilotConnection.pilots"
      },
      Starship: {
        "pilots": "pilotConnection.pilots"
      }
    }

    return {
      url,
      metadata: response.data,
      wrapper
    }
  })
}
