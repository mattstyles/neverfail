import {match} from 'ts-pattern'

import type {Result} from './result'
import {ok, err} from './result'

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
