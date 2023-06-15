import {match} from 'ts-pattern'

import type {Option} from './option'
import {some, none} from './option'
import * as O from './option'
import {pipe} from './fn'

// number -> number
const square = (x: number) => x ** 2
// number -> number -> number
const add = (x: number) => (y: number) => x + y
// number -> string
const toString = (x: number) => x.toString()
// number -> Option<number>
const inverse = (x: number) => (x === 0 ? none() : some(1 / x))

describe('Option', () => {
  test('Constructor', () => {
    const s = some(10)
    expect(s._tag).toBe('some')
    expect(s.value).toBe(10)

    const n = none()
    expect(n._tag).toBe('none')
  })
})

describe('Option::ts-pattern interop', () => {
  test('Matching', () => {
    function withMatch(opt: Option<string>): string | null {
      return match(opt)
        .with({_tag: 'some'}, ({value}) => value)
        .with({_tag: 'none'}, () => null)
        .exhaustive()
    }

    expect(withMatch(some('str'))).toBe('str')
    expect(withMatch(none())).toBe(null)
  })
})

describe('Option::orElse', () => {
  test('orElse', () => {
    expect(O.orElse(10, some(4))).toBe(4)
    expect(O.orElse(3, some(0))).toBe(0)
    expect(O.orElse(0, none())).toBe(0)
  })

  test('orElse::types', () => {
    // Is good, types match
    O.orElse(2, some(4))

    // TS will error as types do not match
    // @ts-expect-error orElse types must match
    O.orElse('string', some(4))
    // @ts-expect-error orElse types must match
    O.orElse(4, some('string'))

    expect(true).toBe(true)
  })
})

describe('Option::map', () => {
  test('map::fn', () => {
    const tests = [
      {
        fixture: some(10),
        expected: 100,
        defaultValue: 4,
        op: O.map(square),
      },
      {
        fixture: some(0),
        expected: 0,
        defaultValue: 23,
        op: O.map(square),
      },
      {
        fixture: some('world'),
        expected: 'hello world',
        defaultValue: 'foo',
        op: O.map((x: string) => 'hello ' + x),
      },
      {
        fixture: none(),
        expected: 23,
        defaultValue: 23,
        op: O.map(square),
      },
    ]

    for (const {fixture, expected, defaultValue, op} of tests) {
      // @ts-expect-error each clause differs the type
      const output = op(fixture)
      expect(O.orElse<unknown>(defaultValue, output)).toBe(expected)
    }
  })

  test('map to a different type', () => {
    const fn = O.map(toString)
    const expected = '42'
    const output = O.orElse('error', fn(some(42)))

    // @ts-expect-error output should be correctly typed as a string and not assignable to a number
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const foo: number = output

    expect(typeof output).toBe('string')
    expect(output).toBe(expected)
  })
})

describe('Option::flatMap', () => {
  test('flatMap::fn', () => {
    const tests = [
      {
        fixture: some(10),
        expected: 1 / 10,
        defaultValue: 4,
        op: O.flatMap(inverse),
      },
      {
        // Can not divide by 0, will result in a None
        fixture: some(0),
        expected: 23,
        defaultValue: 23,
        op: O.flatMap(inverse),
      },
      {
        fixture: none(),
        expected: 23,
        defaultValue: 23,
        op: O.flatMap(inverse),
      },
    ]

    for (const {fixture, expected, defaultValue, op} of tests) {
      const output = op(fixture)
      expect(O.orElse<unknown>(defaultValue, output)).toBe(expected)
    }
  })
})

describe.skip('Option::ap', () => {})

describe('Options are pipeable', () => {
  test('Piping an option through a transform', () => {
    const op = pipe(O.map(square), O.flatMap(inverse))
    const output = op(some(4))

    expect(O.orElse(42, output)).toBe(1 / 16)
  })

  test('Pipe using Option functions', () => {
    const op = pipe(O.map(add(4)), O.orElse(0))
    expect(op(some(10))).toBe(14)
  })
})
