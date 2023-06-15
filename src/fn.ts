/**
 * Sequentially invokes a list of functions passing values along the list.
 *
 * Almost identical to [fp-ts/function/pipe](https://github.com/gcanti/fp-ts/blob/master/src/function.ts#L416) but is curried.
 */

type TrFn<A, B> = (a: A) => B
type IdFn<A, B = unknown> = (a: A) => B
export function pipe<A, B>(ab: TrFn<A, B>): IdFn<A, B>
export function pipe<A, B, C>(ab: TrFn<A, B>, bc: TrFn<B, C>): IdFn<A, C>
export function pipe<A, B, C, D>(
  ab: TrFn<A, B>,
  bc: TrFn<B, C>,
  cd: TrFn<C, D>
): IdFn<A, D>
export function pipe<A, B, C, D, E>(
  ab: TrFn<A, B>,
  bc: TrFn<B, C>,
  cd: TrFn<C, D>,
  de: TrFn<D, E>
): IdFn<A, E>
export function pipe<A, B, C, D, E, F>(
  ab: TrFn<A, B>,
  bc: TrFn<B, C>,
  cd: TrFn<C, D>,
  de: TrFn<D, E>,
  ef: TrFn<E, F>
): IdFn<A, F>
export function pipe<A, B = A, C = A, D = A, E = A, F = A>(
  ab: TrFn<A, B>,
  bc?: TrFn<B, C>,
  cd?: TrFn<C, D>,
  de?: TrFn<D, E>,
  ef?: TrFn<E, F>
): IdFn<A> {
  switch (arguments.length) {
    case 1:
      return (data: A) => ab(data)
    case 2:
      return (data: A) => bc!(ab(data))
    case 3:
      return (data: A) => cd!(bc!(ab(data)))
    case 4:
      return (data: A) => de!(cd!(bc!(ab(data))))
    case 5:
      return (data: A) => ef!(de!(cd!(bc!(ab(data)))))
  }

  // eslint-disable-next-line prefer-rest-params
  const args = [...arguments]
  return (data: A) => {
    let value = data
    for (let i = 0; i < args.length; i++) {
      value = args[i](value)
    }
    return value
  }
}
