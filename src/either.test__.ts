import type {Result} from './result'
import {ok, err} from './result'
import * as R from './result'
import type {Option} from './option'
import {some, none} from './option'
import * as O from './option'
import type {Either} from './either'
import * as E from './either'
import {pipe} from './fn'
import {match} from 'ts-pattern'

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
const getAge = (person: Person): Option<number> => {
  return person.age != null && person.age > 0 ? some(person.age) : none()
}
const pre =
  (a: string) =>
  (b: Option<string>): Option<string> => {
    return match(b)
      .with({_tag: 'some'}, ({value}) => some(a + value))
      .with({_tag: 'none'}, () => none())
      .exhaustive()
  }

describe('Interoperability via piping', () => {
  test('pipe:: number -> Result -> Option -> unknown', () => {
    const tests = [
      {
        fixture: 1,
        expected: 'foo1',
        defaultValue: 'error',
        op: pipe(fetchPerson, E.flatMap(getName)),
      },
      {
        fixture: -1,
        expected: 'err',
        defaultValue: 'err',
        op: pipe(fetchPerson, E.flatMap(getName)),
      },
      {
        fixture: 10,
        expected: 24,
        defaultValue: 0,
        op: pipe(fetchPerson, E.flatMap(getAge)),
      },
      // {
      //   fixture: 1,
      //   expected: 'pre::foo1',
      //   defaultValue: 'err',
      //   // @TODO need to lift or convert somehow here, as Either could be an error, in which case we want to ignore the next function on failure state
      //   op: pipe(fetchPerson, E.flatMap(getName), pre('pre::')),
      // },
    ]

    for (const {fixture, expected, defaultValue, op} of tests) {
      const output = op(fixture)
      expect(E.orElse(defaultValue, output)).toBe(expected)
    }
  })
})

describe('Either::map', () => {})

describe('Either::types', () => {
  test('constructor types', () => {
    const a = E.of('foo')
    const b = E.of<string, Error>(new Error('oops'))
  })

  test('map types', () => {
    const aa = E.of<string, Error>('fo')
    const bb = E.map((_: string) => 0)(aa)

    const a: Either<string, Error> = E.of('foo')
    const b: Either<string, Error> = E.of(new Error('oops'))
  })
})
