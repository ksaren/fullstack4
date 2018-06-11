const mongoose = require('mongoose')

const Blog = mongoose.model('Blog', {
  author: String,
  title: String,
  url: String,
  likes: Number
})

module.exports = Blog
