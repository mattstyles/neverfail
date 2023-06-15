// import type {Some, None, Option} from './types/option'
// export type {Some, None, Option}

/**
 * Types
 */

// Option<A>
export interface Some<A> {
  readonly _tag: 'some'
  readonly value: A
}
// Option<never>
export interface None {
  readonly _tag: 'none'
}
export type Option<A> = Some<A> | None

/**
 * @constructor
 *
 * Creates a Some type
 * @param value: A
 * @returns Some
 */
export function some<A>(value: A): Some<A> {
  return {
    _tag: 'some',
    value,
  }
}

/**
 * @constructor
 *
 * Creates a None type
 * @returns None
 */
export function none(): None {
  return {
    _tag: 'none',
  }
}

/**
 * @constructor
 *
 * Creates an Option<A> if passed a NonNullable value
 * @param value
 * @returns
 */
export function of<A>(value?: A): Option<A> {
  return value == null ? none() : some(value)
}

/**
 * @constructor
 *
 * Applies the predicate to determine whether the value `a` becomes a Some | None type
 * @param predicate: (a: A) => boolean
 * @returns (a: A) => Option<A>
 */
export function fromPredicate<A>(
  predicate: (a: A) => boolean
): (a: A) => Option<A> {
  return (a: A) => {
    return predicate(a) ? none() : some(a)
  }
}

/**
 * Checks whether this Option is a Some type
 * @param a: Option<A>
 * @returns boolean
 */
export function isSome<A>(a: Option<A>): a is Some<A> {
  return a._tag === 'some'
}

/**
 * Checks whether this Option is a None type
 * @param a: Option<A>
 * @returns boolean
 */
export function isNone<A>(a: Option<A>): a is None {
  return a._tag === 'none'
}

/**
 * Unpacks the Option
 * @param a: Option<A>
 * @returns A | None
 */
export function join<A>(a: Option<A>): A | None {
  return isNone(a) ? none() : a.value
}

/**
 * Return the value of Option or a default value is Option is a None type.
 *
 * Curried to allow using in chainable interfaces.
 * @param b: A - the default value if Option is None
 * @param a?: Option<A> - the Option to work against
 * @returns A | Option<A> => A - returns the same type as Option
 */
export function orElse<A>(b: A): (a: Option<A>) => A
export function orElse<A>(b: A, a: Option<A>): A
export function orElse<A>(b: A, a?: Option<A>): A | ((a: Option<A>) => A) {
  if (a == null) {
    return function $orElse(a: Option<A>): A {
      return orElse(b, a)
    }
  }

  return isNone(a) ? b : a.value
}

/**
 * Maps a function to a new function that accepts and outputs Options
 *
 * @param fa: (a: A) => B
 * @returns (a: Option<A>) => Option<B>
 */
export function map<A, B>(fa: (a: A) => B): (a: Option<A>) => Option<B> {
  return function $map(a) {
    return isNone(a) ? none() : of(fa(a.value))
  }
}

/**
 * Maps a function that inputs a value and outputs an Option<value> to a function which accepts and outputs an Option
 *
 * @param fa: (a: A) => Option<B>
 * @returns (a: Option<A>) => Option<B>
 */
export function flatMap<A, B>(
  fa: (a: A) => Option<B>
): (a: Option<A>) => Option<B> {
  return function $flatMap(a) {
    return isNone(a) ? none() : join(map(fa)(a))
  }
}

/**
 * Accepts an Option and applies an Option containing function, outputting an Option.
 *
 * @param a: Option<A>
 * @returns (fab: Option<A => B>) => Option<B>
 */
export function ap<A, B>(
  a: Option<A>
): (fab: Option<(a: A) => B>) => Option<B> {
  return function $ap(fab) {
    return isNone(fab) ? none() : isNone(a) ? none() : of(fab.value(a.value))
  }
}
