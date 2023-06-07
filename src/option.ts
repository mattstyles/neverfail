
export interface Some<T> {
  readonly _type: 'some'
  value: T
}
export interface None {
  readonly _type: 'none'
}
export type Option<T> = Some<T> | None


export function Some<T>(value: T): Some<T> {
  return {
    _type: 'some',
    value
  }
}

export function None(): None {
  return {
    _type: 'none'
  }
}
