const jwt = require('jsonwebtoken')
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response) => {
  try {
    const allBlogs = await Blog.find({}).populate('user', { username: 1, name: 1 } )
    let content
    if(allBlogs.length === 0) {
      content = {}
    } else {
      content = allBlogs.map(Blog.format)
    }
    response.json(content).end()
  }
  catch (exception) {
    response.status(400).json({ error: 'something went wrong...' })
  }
})

blogsRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).end()
    }
    response.json(Blog.format(blog)).end()
  }
  catch (exception) {
    response.status(400).send({ error: 'something went wrong...' })
  }
})


blogsRouter.delete('/:id', async (request, response) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }

    const userid = (await User.findById(decodedToken.id)).id
    const remBlog = await Blog.findById(request.params.id)
    if (!remBlog) {
      return response.status(404).end()
    }
    if (remBlog.user.toString() === userid.toString()) {
      await Blog.remove(remBlog)
      return response.status(204).end()
    }
    return response.status(401).json({ error: 'authentication error' })
    // await Blog.findByIdAndRemove(request.params.id)
  }
  catch(exception) {
    response.status(400).end()
  }
})

blogsRouter.post('/', async (request, response) => {

  const {
    title,
    author,
    url,
    likes,
  } = request.body


  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'invalid token' })
    }

    const user = await User.findById(decodedToken.id)


    if (!user || !title || !url ) {
      return response.status(400).json({ error: 'title or url missing' }).end()
    }

    const blog1 = new Blog({
      title,
      likes: likes === undefined ? 0 : likes,
      author,
      url,
      user: user._id
    })
    const result = await blog1.save()

    user.blogs = user.blogs.concat(result._id)
    await user.save()

    response.json(Blog.format(result)).end()
  } catch(exception) {
    if (exception.name === 'JsonWebTokenError' ) {
      response.status(401).json({ error: exception.message })
    } else {
      console.log(exception)
      response.status(500).json({ error: 'something went wrong...' })
    }
  }
})

blogsRouter.put('/:id', async (request, response) => {
  try {
    const { title, author, url, likes } = request.body

    const blog = {
      title,
      author,
      url,
      likes,
    }

    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
    response.json(Blog.format(updatedBlog))

  } catch(exception) {
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter