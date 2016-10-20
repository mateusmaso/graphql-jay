import {q1, q2, q3} from "./queries"
import {swapi, swapiGraphQL} from "./services"

export default function run() {
  var services = [swapi]

  return Promise.all([
    q1(services),
    q2(services),
    q3(services)
  ]).then((response) => {
    console.log("with", response)
  })
}
