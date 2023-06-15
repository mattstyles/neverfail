import {pipe} from './fn'

const double = (x: number) => x * 2
const add = (x: number) => (y: number) => x + y
const toString = (x: number) => x.toString()
const pre = (x: string) => (y: string) => x + y

describe('Function', () => {
  test('pipe::sequence', () => {
    const tests = [
      {
        fixture: 4,
        expected: 8,
        op: pipe(double),
      },
      {
        fixture: 2,
        expected: 14,
        op: pipe(double, add(10)),
      },
      {
        fixture: 42,
        expected: 'Meaning of life is 42',
        op: pipe(toString, pre('Meaning of life is ')),
      },
    ]

    for (const {fixture, expected, op} of tests) {
      expect(op(fixture)).toBe(expected)
    }
  })
})

describe('pipe::types', () => {
  test('inputs', () => {
    pipe(double)(23)
    pipe(double, add(4))(42)

    // @ts-expect-error pipe knows that the first function accepts a type
    pipe(double)('error')
    // @ts-expect-error pipe knows that the first function accepts a type
    pipe(double, add(4))('error')
  })

  test('transitive', () => {
    pipe(toString, pre('::'))(42)

    // @ts-expect-error pipe knows that function inputs/outputs should match
    pipe(toString, add(4))
  })

  // Disable no-unused-vars as we use those to type check i.e TS will throw an error if they do not match types
  test('output', () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const a: number = pipe(double)(1)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const b: number = pipe(double, add(2))(4)

    // @ts-expect-error pipe knows about the output type
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const c: string = pipe(double)(4)
  })

  test('TS understands the arity of pipe', () => {
    // @ts-expect-error TS should warn when arity overflows as this means we can not pass a typed output
    pipe(double, double, double, double, double, double)(42)
  })
})
