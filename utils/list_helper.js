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
  return formatBlog(favorite)
}

const mostBlogs = (blogs) => {
  let authors = {}
  blogs.forEach(blog => {authors[blog.author] += 1})
  authors.sortByValue()
  return authors.first
}



//helper function
const formatBlog = (blog) => {
  return {
    title: blog.title,
    author: blog.author,
    likes: blog.likes
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  formatBlog,
  mostBlogs
}

//examples
// const palindrom = (string) => {
//     return string.split('').reverse().join('')
//   }

//   const average = (array) => {
//     const reducer = (sum, item) => {
//       return sum + item
//     }

//     return array.reduce(reducer, 0) / array.length
//   }

//   module.exports = {
//     palindrom,
//     average
//   }
