const listHelper = require('../utils/list_helper')

test('dummy is called', () => {
  const blogs = []
  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

// Some examples
// test('palindrom of a', () => {
//   const result = palindrom('a')

//   expect(result).toBe('a')
// })

// test('palindrom of react', () => {
//   const result = palindrom('react')

//   expect(result).toBe('tcaer')
// })

// test('palindrom of saippuakauppias', () => {
//   const result = palindrom('saippuakauppias')

//   expect(result).toBe('saippuakauppias')
// })
