const Blog = require('../models/blog')

const dummy = () => {
  return 1*1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item
  }
  return blogs
    .map(blog => blog.likes)
    .reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev : current, {})
  return Blog.format(favorite)
}

const mostBlogs = function  (bloglist) {
  let authors = []
  bloglist.forEach((blog) => {
    const auth = authors.find(a => a.author === blog.author)
    if (auth) {
      auth.blogs += 1
    } else {
      authors.push({ author: blog.author, blogs: 1 })
    }
  })
  if (authors.length === 0) return {}
  authors.sort((a,b) => b.blogs - a.blogs)
  return authors[0]
}

const mostLikes = function  (bloglist) {
  let authorLikes = []
  bloglist.forEach((blog) => {
    const auth = authorLikes.find(a => a.author === blog.author)
    if (auth) {
      auth.likes += blog.likes
    } else {
      authorLikes.push({ author: blog.author, likes: blog.likes })
    }
  })
  if (authorLikes.length === 0) return {}
  authorLikes.sort((a,b) => b.likes - a.likes)
  return authorLikes[0]
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
