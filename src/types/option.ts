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
