const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const { seed, seedBlogs, seedUser, blogsInDb, usersInDb, nonExistingId } = require('./test_helper')

describe.only('USER api - when there is initially one user at db', async () => {

  beforeEach(async () => await seedUser())

  test('POST /api/users succeeds with a fresh username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length+1)
    const usernames = usersAfterOperation.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('POST /api/users fails with reserved username', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: usersBeforeOperation[0].username,
      name: 'Matti Luukkainen',
      password: 'salainen'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })

  test('POST /api/users fails with too short password', async () => {
    const usersBeforeOperation = await usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'sa'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAfterOperation = await usersInDb()
    expect(usersAfterOperation.length).toBe(usersBeforeOperation.length)
  })
})



describe('Blog GET API, ', () => {

  beforeEach(async () => {
    await seed()
  })

  test('blogs are returned as json', async () => {
    const result = await api.get('/api/blogs').expect(200)
    expect(result.type).toBe('application/json')
  })

  test('all blogs are returned as json by GET /api/blogs', async () => {
    const blogsInDatabase = await blogsInDb()

    const response = await api.get('/api/blogs').expect(200)
    expect(response.type).toBe('application/json')

    expect(response.body.length).toBe(blogsInDatabase.length)

    const titles = response.body.map(b => b.title)
    blogsInDatabase.forEach(blog => {
      expect(titles).toContain(blog.title)
    })
  })

  test('individual blogs are returned as json by GET /api/blogs/:id', async () => {
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

  beforeEach(async () => {
    await seed()
  })

  test('a valid blog can be added ', async () => {

    const blogsBeforeAddition = await blogsInDb()
    const u1 = (await usersInDb())[0]

    const newBlog = {
      title: 'Unit testing using Jest',
      author: 'B. Wisser',
      url: 'http://blog/tooGood/toBeTrue',
      likes: 0,
      userId: u1.id
    }
    await api.post('/api/blogs').send(newBlog)

    const response = await api
      .get('/api/blogs')

    const titles = response.body.map(r => r.title)

    expect(response.body.length).toBe(blogsBeforeAddition.length + 1)
    expect(titles).toContain('Unit testing using Jest')
  })

  test('a blog without title can not be added ', async () => {

    const blogsBeforeAddition = await blogsInDb()
    const u1 = (await usersInDb())[0]

    const newBlog = {
      author: 'B. Wisser',
      url: 'http://blog/tooGood/toBeTrue',
      likes: 0,
      userId: u1.id
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(blogsBeforeAddition.length)

  })

  test('a blog without url can not be added ', async () => {

    const blogsBeforeAddition = await blogsInDb()
    const u1 = (await usersInDb())[0]

    const newBlog = {
      author: 'B. Wisser',
      title: 'Unit testing using Jest',
      likes: 0,
      userId: u1.id,
    }
    await api.post('/api/blogs').send(newBlog).expect(400)

    const response = await api
      .get('/api/blogs')

    expect(response.body.length).toBe(blogsBeforeAddition.length)
  })

  test('a blog without author can be added ', async () => {

    const blogsBeforeAddition = await blogsInDb()
    const u1 = (await usersInDb())[0]

    const newBlog = {
      title: 'Unit testing using Jest',
      likes: 0,
      url: 'http://blog/tooGood/toBeTrue',
      userId: u1.id
    }
    await api.post('/api/blogs').send(newBlog).expect(200)

    const response = await api
      .get('/api/blogs')

    const authors = response.body.map(r => r.author)

    expect(response.body.length).toBe(blogsBeforeAddition.length + 1)
    expect(authors).toContain(undefined)
  })
  test('a blog without likes can be added and is get default value 0 ', async () => {

    const u1 = (await usersInDb())[0]

    const newBlog = {
      author: 'B. Wisser',
      title: 'Unit testing using Jest',
      url: 'http://blog/tooGood/toBeTrue',
      userId: u1.id
    }

    const savedBlog = (await api.post('/api/blogs').send(newBlog).expect(200)).body

    const response = await api
      .get(`/api/blogs/${savedBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('a blog with preset likes can be added and gets right value', async () => {

    const u1 = (await usersInDb())[0]

    const newBlog = {
      author: 'B. Wisser',
      title: 'Unit testing using Jest',
      url: 'http://blog/tooGood/toBeTrue',
      likes: 6,
      userId: u1.id
    }

    const savedBlog = (await api.post('/api/blogs').send(newBlog).expect(200)).body

    const response = await api
      .get(`/api/blogs/${savedBlog.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(6)
  })
})

describe('Blog DELETE API, ', () => {

  beforeEach(async () => {
    await seed()
  })

  test('DELETE /api/blogs/:id succeeds with proper statuscode', async () => {
    const blogsBeforeDeletion = await blogsInDb()

    const blogToBeRemoved = blogsBeforeDeletion[0]

    await api
      .delete(`/api/blogs/${blogToBeRemoved.id}`)
      .expect(204)

    const blogsAfterDeletion = await blogsInDb()

    const titles = blogsAfterDeletion.map(b => b.title)

    expect(titles).not.toContain(blogToBeRemoved.title)
    expect(blogsAfterDeletion.length).toBe(blogsBeforeDeletion.length - 1)
  })

  test('DELETE /api/blogs/:id with nonexisting id fails with proper statuscode', async () => {
    const blogsBeforeDeletion = await blogsInDb()

    await api
      .delete(`/api/blogs/${nonExistingId}`)
      .expect(400)

    const blogsAfterDeletion = await blogsInDb()
    expect(blogsAfterDeletion.length).toBe(blogsBeforeDeletion.length)
  })
})

describe('Blog PUT API, ', () => {

  beforeEach(async () => {
    const u = await seedUser()
    await seedBlogs(u)
  })

  test('PUT /api/blogs/:id updates blog\'s single field', async () => {

    const u1 = (await usersInDb())[0]

    const newBlog = {
      author: 'B. Wisser',
      title: 'Unit testing using Jest',
      url: 'http://blog/tooGood/toBeTrue',
      likes: 6,
      userId: u1.id,
    }

    const savedBlog = (await api.post('/api/blogs').send(newBlog).expect(200)).body
    const oldAuthor = savedBlog.author
    const newAuthor = 'C. Wisser'

    const blogsBeforeUpdate = await blogsInDb()

    await api.put(`/api/blogs/${savedBlog.id}`).send({ author: newAuthor }).expect(200)

    const blogsAfterUpdate = await blogsInDb()

    const authors = blogsAfterUpdate.map(b => b.author)

    expect(authors).not.toContain(oldAuthor)
    expect(authors).toContain(newAuthor)
    expect(blogsAfterUpdate.length).toBe(blogsBeforeUpdate.length)
  })

  test('PUT /api/blogs/:id with nonexisting id fails with proper statuscode', async () => {
    await api
      .put(`/api/blogs/${nonExistingId}`).send({ title: 'Impossible Change' })
      .expect(400)

    const blogsAfterUpdate = await blogsInDb()

    const titles = blogsAfterUpdate.map(b => b.title)

    expect(titles).not.toContain('Impossible Change')
  })

  test('PUT /api/blogs/:id updates blog\'s likes', async () => {

    const u1 = (await usersInDb())[0]

    const newBlog = {
      author: 'B. Wisser',
      title: 'Unit testing using Jest',
      url: 'http://blog/tooGood/toBeTrue',
      likes: 6,
      userId: u1.id
    }

    const savedBlog = (await api.post('/api/blogs').send(newBlog).expect(200)).body
    const oldLikes = savedBlog.likes
    await api.put(`/api/blogs/${savedBlog.id}`).send({ likes: oldLikes + 1 }).expect(200)

    const newLikes = (await api.get(`/api/blogs/${savedBlog.id}`).expect(200)).body.likes

    expect(oldLikes).toBe(newLikes - 1)
  })
})

afterAll(() => {
  server.close()
})