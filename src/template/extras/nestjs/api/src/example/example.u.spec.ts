const addNumber = (a: number) => {
  return (b: number) => {
    return a + b
  }
}

const addFiveToNumber = addNumber(5)

describe('Example Unit test', () => {
  it('toBe', () => {
    const expectedNumber = addFiveToNumber(2)

    expect(expectedNumber).toBe(7)
  })
})
