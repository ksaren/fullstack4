const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { initialBlogs, seedBlogs, blogsInDb, nonExistingId } = require('./test_helper')


describe('Blog GET API, ', () => {

  beforeEach(async () => await seedBlogs())

  test('blogs are returned as json', async () => {
    const result = await api.get('/api/blogs').expect(200)
    expect(result.type).toBe('application/json')
  })

  test('all notes are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api.get('/api/blogs').expect(200)
    expect(response.type).toBe('application/json')

    expect(response.body.length).toBe(blogsInDatabase.length)

    const titles = response.body.map(b => b.title)
    blogsInDatabase.forEach(blog => {
      expect(titles).toContain(blog.title)
    })
  })

  test('individual notes are returned as json by GET /api/blogs/:id', async () => {
    const blogsInDatabase = await blogsInDb()
    const oneBlog = blogsInDatabase[0]

    const response = await api
      .get(`/api/blogs/${oneBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.title).toBe(oneBlog.title)
  })

  test('404 returned by GET /api/blogs/:id with nonexisting valid id', async () => {
    const validNonexistingId = await nonExistingId()

    await api
      .get(`/api/blogs/${validNonexistingId}`)
      .expect(404)
  })

  test('400 is returned by GET /api/blogs/:id with invalid id', async () => {
    const invalidId = '123not456valid789Id'

    await api
      .get(`/api/blogs/${invalidId}`)
      .expect(400)
  })

})

describe('Blog POST API, ', () => {
  beforeEach(async () => await seedBlogs())

  test('a valid blog can be added ', async () => {

    const blogsBeforeAddition = await blogsInDb()

    const newBlog = {
      title: 'Unit testing using Jest',
      author: 'B. Wisser',
      url: 'http://blog/tooGood/toBeTrue',
      likes: 0,
    }
    await api.post('/api/blogs').send(newBlog)

    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(blogsBeforeAddition.length + 1)
    expect(titles).toContain('Unit testing using Jest')
  })
})

afterAll(() => {
  server.close()
})


