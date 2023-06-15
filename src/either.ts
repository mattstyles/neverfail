import type {Option, Some, None} from './option'
import type {Result, Ok, Err} from './result'

import {P, match} from 'ts-pattern'
import {some, none} from './option'
import * as O from './option'
import {err} from './result'
import * as R from './result'

export type Either<A, E = unknown> = Some<A> | Ok<A> | None | Err<E>

export function of<A, E>(a: Result<A, E> | Option<A>): Either<A, E> {
  return match(a)
    .with(P.union({_tag: 'some'}, {_tag: 'ok'}), ({value}) => some(value))
    .with({_tag: 'err'}, ({err: e}) => err(e))
    .with({_tag: 'none'}, () => none())
    .exhaustive()
}

// @TODO
export function join<A, E>(a: Either<A, E>): A | Err<E> | None {
  return match(a)
    .with(P.union({_tag: 'some'}, {_tag: 'ok'}), ({value}) => value)
    .with({_tag: 'err'}, ({err: e}) => err(e))
    .with({_tag: 'none'}, () => none())
    .exhaustive()
}

// @TODO
export function orElse() {}

// @TODO
export function map<A, B>(fa: (a: A) => B): (a: Either<A>) => Either<B> {
  return function $map(a) {
    return match(a)
      .with(P.union({_tag: 'some'}, {_tag: 'ok'}), ({value}) => {
        try {
          const newValue = fa(value)
          return O.of(newValue)
        } catch (e) {
          return err(e)
        }
      })
      .with({_tag: 'err'}, ({err: e}) => err(e))
      .with({_tag: 'none'}, () => none())
      .exhaustive()
  }
}

// @TODO
export function flatMap<A, B>(
  fa: (a: A) => Either<B>
): (a: Either<A>) => Either<B> {
  return function $flatMap(a) {
    return join(map(fa)(a))
    return match(a)
      .with(P.union({_tag: 'some'}, {_tag: 'ok'}), () => {
        return join(map(fa)(a))
      })
      .with({_tag: 'err'}, ({err: e}) => err(e))
      .with({_tag: 'none'}, () => none())
      .exhaustive()
  }
}
