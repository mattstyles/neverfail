
import {match} from 'ts-pattern'

import type {Option} from './option'
import {Some, None} from './option'

describe('Option', () => {
  test('Constructor', () => {
    const some = Some(10)
    expect(some._type).toBe('some')
    expect(some.value).toBe(10)

    const none = None()
    expect(none._type).toBe('none')
  })
})

describe('Option::ts-pattern interop', () => {
  test('Matching', () => {
    function withMatch(opt: Option<string>): string | null {
      return match(opt)
        .with({_type: 'some'}, ({value}) => value)
        .with({_type: 'none'}, () => null)
        .exhaustive()
    }

    expect(withMatch(Some('str'))).toBe('str')
    expect(withMatch(None())).toBe(null)
  })

})