// import type {Ok, Err, Result} from './types/result'
// export type {Ok, Err, Result}

export interface Ok<A> {
  readonly _tag: 'ok'
  readonly value: A
}
export interface Err<E> {
  readonly _tag: 'err'
  readonly err: E
}
export type Result<A, E = unknown> = Ok<A> | Err<E>

export function ok<A>(value: A): Ok<A> {
  return {
    _tag: 'ok',
    value,
  }
}

export function err<E>(err: E): Err<E> {
  return {
    _tag: 'err',
    err,
  }
}

/**
 * Creates an Ok if A is not an instanceof Error
 * Note that JS can throw anything, in which case you should create Ok or Err yourself or consider using `Result.fromPredicate`
 */
export function of<A>(value: A) {
  return value instanceof Error ? err(value) : ok(value)
}

// @TODO
export function fromPredicate() {}

// @TODO
export function fromThrowable() {}

export function isOk<A>(a: Result<A>): a is Ok<A> {
  return a._tag === 'ok'
}
export function isErr<E>(a: Result<unknown, E>): a is Err<E> {
  return a._tag === 'err'
}

export function join<A, E>(a: Result<A, E>): A | Err<E> {
  return isErr(a) ? err(a.err) : a.value
}

export function orElse<A>(b: A): (a: Result<A>) => A
export function orElse<A>(b: A, a: Result<A>): A
export function orElse<A>(b: A, a?: Result<A>): A | ((a: Result<A>) => A) {
  if (a == null) {
    return function $orElse(a: Result<A>): A {
      return orElse(b, a)
    }
  }

  return isErr(a) ? b : a.value
}

export function map<A, B>(fa: (a: A) => B): (a: Result<A>) => Result<B> {
  return function $map(a) {
    return isErr(a) ? err(a.err) : of(fa(a.value))
  }
}

export function flatMap<A, B>(
  fa: (a: A) => Result<B>
): (a: Result<A>) => Result<B> {
  return function $flatMap(a) {
    return isErr(a) ? err(a.err) : join(map(fa)(a))
  }
}

export function ap<A, B>(
  a: Result<A>
): (fab: Result<(a: A) => B>) => Result<B> {
  return function $ap(fab) {
    return isErr(fab)
      ? err(fab.err)
      : isErr(a)
      ? err(a.err)
      : of(fab.value(a.value))
  }
}
