import type {Option, Some, None} from './option'
import type {Result, Ok, Err} from './result'

import {P, match} from 'ts-pattern'
import {some, none} from './option'
import * as O from './option'
import {err} from './result'
import * as R from './result'

export type Either<A = never, E = unknown> = Some<A> | Ok<A> | None | Err<E>

export function of<A = never, E = Error>(a: A) {
  // return match(a)
  //   .with(P.union({_tag: 'some'}, {_tag: 'ok'}), ({value}) => some(value))
  //   .with({_tag: 'err'}, ({err: e}) => err(e))
  //   .with({_tag: 'none'}, () => none())
  //   .exhaustive()

  if (a == null) {
    return none()
  }

  if (a instanceof Error) {
    const out: Either<never, E> = err(a as E)
    // return out
    // return err(a as E) as Either<never, E>
    return err(a as E)
  }

  return some(a)

  // return match(a)
  //   .with(P.nullish, () => none())
  //   .with(P.instanceOf(Error), () => err(a as E))
  //   .otherwise(() => some(a as A))
}

export function join<A, E>(a: Either<A, E>): A | Err<E> | None {
  return match(a)
    .with(P.union({_tag: 'some'}, {_tag: 'ok'}), ({value}) => value)
    .with({_tag: 'err'}, ({err: e}) => err(e))
    .with({_tag: 'none'}, () => none())
    .exhaustive()
}

// @TODO
export function orElse<A, E = unknown>(b: A): (a: Either<A>) => A
export function orElse<A>(b: A, a: Either<A>): A
export function orElse<A>(b: A, a?: Either<A>): A | ((a: Either<A>) => A) {
  if (a == null) {
    return function $orElse(a: Either<A>): A {
      return orElse(b, a)
    }
  }

  return match(a)
    .with(P.union({_tag: 'some'}, {_tag: 'ok'}), ({value}) => value)
    .with({_tag: 'err'}, () => b)
    .with({_tag: 'none'}, () => b)
    .exhaustive()
}

// @TODO
export function map<A, B, E, F>(
  fa: (a: A) => B
): (a: Either<A, E>) => Either<B, E | F> {
  return function $map(a) {
    return (
      match(a)
        .with(P.union({_tag: 'some'}, {_tag: 'ok'}), ({value}) => {
          try {
            const newValue = fa(value)
            return of(newValue)
          } catch (e) {
            return err<F>(e as F)
          }
        })
        // .with({_tag: 'some'}, ({value}) => {
        //   return of(fa(value))
        // })
        .with({_tag: 'err'}, ({err: e}) => err(e))
        .with({_tag: 'none'}, () => none())
        .exhaustive()
    )
  }
}

// @TODO
export function flatMap<A, B, E, F>(
  fa: (a: A) => Either<B, E>
): (a: Either<A, E>) => Either<B, E | F> {
  return function $flatMap(a) {
    return join(map(fa)(a))
    // return match(a)
    //   .with(P.union({_tag: 'some'}, {_tag: 'ok'}), () => {
    //     return join(map(fa)(a))
    //   })
    //   .with({_tag: 'err'}, ({err: e}) => err(e))
    //   .with({_tag: 'none'}, () => none())
    //   .exhaustive()
  }
}
