const Blog = require('../models/blog')
const User = require('../models/user')
const apiHelpers = require('../utils/list_helper')

const initialBlogs = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
]

const seedBlogs = async (userid) => {
  await Blog.remove({})
  const blogObjects = initialBlogs.map(b => new Blog(Object.assign(b, { user: userid })))
  const blogPromises = blogObjects.map(bO => bO.save())
  await Promise.all(blogPromises)
}

const seedUser = async () => {
  await User.remove({})
  const user = new User({ username: 'root', password: 'sekret' })
  await user.save()
}

const seed = async () => {
  await seedUser()
  const u = (await usersInDb())[0]
  await seedBlogs(u.id)
}

const nonExistingId = async () => {
  const blog = new Blog()
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(Blog.format)
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(User.format)
}

module.exports = {
  initialBlogs,
  seedBlogs,
  seedUser,
  seed,
  nonExistingId,
  blogsInDb,
  usersInDb
}
