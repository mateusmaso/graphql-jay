import {q1, q2, q3} from "./queries"

export default function run() {
  return Promise.all([
    q1(),
    q2(),
    q3()
  ])
}
