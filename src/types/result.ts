export interface Ok<A> {
  readonly _tag: 'ok'
  readonly value: A
}
export interface Err<E> {
  readonly _tag: 'err'
  readonly err: E
}
export type Result<A, E = unknown> = Ok<A> | Err<E>
