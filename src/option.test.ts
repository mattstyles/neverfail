
import {Some, None} from './option'

describe('Option', () => {
  test('Constructor', () => {
    const some = Some(10)
    expect(some._type).toBe('Some')
    expect(some.value).toBe(10)

    const none = None()
    expect(none._type).toBe('None')
  })
})