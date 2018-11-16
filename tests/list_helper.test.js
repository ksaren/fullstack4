const listHelper = require('../utils/list_helper')
const sampleList = require('../utils/sample_list')

describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('of list having only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('of empty list equals 0', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('of list having some blogs is correctly calculated', () => {
    const result = listHelper.totalLikes(sampleList)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('is returned even if list has only one blog', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toEqual(listHelper.formatBlog(listWithOneBlog[0]))
  })

  test('of empty list equals {}', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toEqual({})
  })

  test('of list having some blogs is correctly selected', () => {
    const result = listHelper.favoriteBlog(sampleList)
    expect(result).toEqual(listHelper.formatBlog(sampleList[2]))
  })
})

describe('Author with most blogs', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('is returned even if list has only one blog', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toEqual({
      author: listWithOneBlog.author,
      blogs: 1
    })
  })

  test('of empty list equals {}', () => {
    const result = listHelper.mostBlogs([])
    expect(result).toEqual({})
  })

  test('of list having some blogs is correctly selected', () => {
    const result = listHelper.mostBlogs(sampleList)
    expect(result).toEqual({
      author: 'Robert C. Martin',
      blogs: 3
    })
  })
})