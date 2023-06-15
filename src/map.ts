import {P, match} from 'ts-pattern'

import type {Option} from './option'
import type {Result} from './result'

import {Some, None} from './option'
import {Ok, Err} from './result'

// export function map<T, U>(fn: (fa: T) => U): (fa: Option<T>) => Option<U>
// export function map<T, U>(fn: (fa: T) => U): (fa: Result<T>) => Result<U>
export function map<T, U>(
  fn: (fa: T) => U
  // ): ((fa: Option<T>) => Option<U>) | ((fa: Result<T>) => Result<U>) {
): (fa: Option<T> | Result<T>) => Option<U> | Result<U> {
  // ) {
  return (fa: Option<T> | Result<T>) => {
    return match(fa)
      .with({_type: 'some'}, ({value}) => {
        const newValue = fn(value)
        return newValue == null ? None() : Some(newValue)
        // return Some(newValue)
      })
      .with({_type: 'ok'}, ({value}) => {
        try {
          const newValue = fn(value)
          return Ok(newValue)
        } catch (err) {
          // @TODO need to be careful here as this might be a type of error we actually want to catch. Best case here might be to use flatMap.
          return Err(err)
        }
      })
      .with({_type: P.union('none', 'err')}, (_) => _)
      .exhaustive()
  }
}
