
export interface Some<T> {
  readonly _type: 'Some'
  value: T
}
export interface None {
  readonly _type: 'None'
}
export type Option<T> = Some<T> | None

export function Some<T>(value: T): Some<T> {
  return {
    _type: 'Some',
    value
  }
}

export function None(): None {
  return {
    _type: 'None'
  }
}