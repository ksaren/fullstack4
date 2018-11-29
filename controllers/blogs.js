const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const { formatBlog } = require('../utils/list_helper')

blogsRouter.get('/', async (request, response) => {
  try {
    const allBlogs = await Blog.find({})
    let content
    if(allBlogs.length === 0) {
      content = {}
    } else {
      content = allBlogs.map(formatBlog)
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
    response.json(formatBlog(blog)).end()
  }
  catch (exception) {
    response.status(400).send({ error: 'something went wrong...' })
  }
})


blogsRouter.delete('/:id', async (request, response) => {
  try {
    // const remBlog = await Blog.findById(request.params.id)
    // if (!remBlog) {
    //   return response.status(404).end()
    // }
    // await Blog.remove(remBlog)
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }
  catch(exception) {
    response.status(400).end()
  }
})

blogsRouter.post('/', async (request, response) => {
  try {
    const { title, author, url, likes } = request.body
    if (!title || !url ) {
      return response.status(400).json({ error: 'title or url missing' }).end()
    }
    const blog1 = new Blog({
      title,
      likes: likes === undefined ? 0 : likes,
      author,
      url,
    })
    const result = await blog1.save()
    response.json(formatBlog(result)).end()
  } catch(exception) {
    response.status(400).end()
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
    response.json(formatBlog(updatedBlog))

  } catch(exception) {
    response.status(400).send({ error: 'malformatted id' })
  }
})

module.exports = blogsRouter