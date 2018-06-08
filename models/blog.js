const mongoose = require('mongoose')

const mongoUrl = process.env.MONGODB_URI

if ( process.env.NODE_ENV !== 'production' ) {
    require('dotenv').config()
  }
  
mongoose.connect(mongoUrl)

const Blog = mongoose.model('Blog', {
  title: String,
  author: String,
  url: String,
  likes: Number
})

module.exports = Blog
