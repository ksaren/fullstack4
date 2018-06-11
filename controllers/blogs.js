const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
      .catch(() => {
          console.log("Error in getting all blogs")
          response.status(404).end()
      })
  })
  
  blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
      .catch(() => {
          console.log("Error in saving blog")
          response.status(404).end()
      })
  })

module.exports = blogsRouter