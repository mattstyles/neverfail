import {match} from 'ts-pattern'
import {Test} from 'ts-toolbelt'

import type {Result} from './result'
import {ok, err} from './result'
import * as R from './result'

describe('Result', () => {
  test('Constructors::Ok', () => {
    const o = ok(10)
    expect(o._tag).toBe('ok')
    expect(o.value).toBe(10)

    const rawError = new Error('something')
    const e = err(rawError)
    expect(e._tag).toBe('err')
    expect(e.err).toBe(rawError)
  })
})

describe('Result::ts-pattern interop', () => {
  test('Matching', () => {
    function withMatch(opt: Result<string, string>): string {
      return match(opt)
        .with({_tag: 'ok'}, ({value}) => value)
        .with({_tag: 'err'}, ({err}) => err)
        .exhaustive()
    }

    expect(withMatch(ok('str'))).toBe('str')
    expect(withMatch(err('string error'))).toBe('string error')
  })
})

describe('Result::types', () => {
  describe('Result::of', () => {
    const a: Result<string, unknown> = R.of('string')
    // @ts-expect-error R.of understands types
    const b: Result<number> = R.of('string')

    const c: Result<never, Error> = err(new Error('oops'))
    const d: Result<string, unknown> = ok('string')
  })

  describe('Result::map', () => {
    const numToString = (x: number) => 'string' + x
    const toError = (e: unknown) =>
      e instanceof Error ? e : new Error('unhandled')

    const a: Result<string, Error> = R.map(numToString, toError)(ok(12))

    const b: Result<string, Error> = R.map(
      numToString,
      toError
    )(err(new Error('problem')))

    const c: Result<string, Error> = R.map(
      numToString,
      (e: unknown) => 'error_string'
    )(ok(12))
    const d: Result<string, Error> = R.map(
      numToString,
      (e: unknown) => 'error_string'
    )(err(new Error('error type')))
  })
})
