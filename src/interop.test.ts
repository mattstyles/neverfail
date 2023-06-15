import type {Result} from './result'
import {ok, err} from './result'
import * as R from './result'
import type {Option} from './option'
import {some, none} from './option'
import * as O from './option'
import type {Either} from './either'
import * as E from './either'
import {pipe} from './fn'

type Person = {
  name: string
  age: number
}
const fetchPerson = (id: number): Result<Person, Error> => {
  return id <= 0
    ? err(new Error('invalid id'))
    : ok({name: 'foo' + id, age: 24})
}
const getName = (person: Person): Option<string> => O.of(person.name)

describe('Interoperability between base type classes', () => {
  test('pipe:: Result -> Option ', () => {
    const fn = pipe(fetchPerson, E.of, E.flatMap(getName))
    const output = fn(17)

    console.log(output)

    console.log(fn(-1))
  })
})
