import {match} from 'ts-pattern'

import type {Option} from './option'
import {Some, None} from './option'
import {map} from './map'

function unwrap<T>(o: Option<T>): T | null {
  return match(o)
    .with({_type: 'some'}, ({value}) => value)
    .with({_type: 'none'}, () => null)
    .exhaustive()
}

describe('Map', () => {
  describe('Map::Option', () => {
    const toUpper = map((x: string) => x.toUpperCase())
    const nullable = map((x: string) => null)

    const foo = [toUpper, nullable].reduce((x, curr) => {
      return curr(x)
    }, Some('mystring'))
    const bar = nullable(None())

    test('Running a map function over an Option', () => {
      expect(unwrap(toUpper(Some('foo')))).toBe('FOO')
      expect(unwrap(toUpper(None()))).toBe(null)
    })

    test('When mapping a function that can return null that null is wrapped in an Option<never>', () => {
      const output = nullable(Some('foo'))
      expect(output._type).toBe('none')
    })
  })
})
