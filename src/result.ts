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
 * Always creates an Ok type.
 */
export function of<A>(value: A): Result<A> {
  // return value instanceof Error ? err(value as Error) : ok(value)
  return ok(value)
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

export function map<A, B, E, F>(
  fa: (a: A) => B,
  toErr: (e: unknown) => F
): (a: Result<A, E>) => Result<B, E | F> {
  return function $map(a) {
    // fa could throw, we should wrap here
    // return isErr(a) ? err(a.err) : of(fa(a.value))

    if (isErr(a)) {
      return err(a.err)
    }

    try {
      const newValue = fa(a.value)
      return ok(newValue)
    } catch (e) {
      return err(toErr(e))
      // return err(toErr != null ? toErr(e) : e)
    }
  }
}

export function flatMap<A, B, E, F>(
  fa: (a: A) => Result<B, E>
): (a: Result<A, E>) => Result<B, E | F> {
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
